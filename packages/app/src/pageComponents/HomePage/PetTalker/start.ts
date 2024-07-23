/* eslint-disable @talk-with-your-pet/no-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequiredEnvVar } from '@/common/env';
import ms from 'ms';
import { toast } from 'react-hot-toast';
import { RetellWebClient } from 'retell-client-js-sdk';

import { RegisterCallResponseSchema } from '@/app/apiTypes';

const NEXT_PUBLIC_ROBOFLOW_PUBLISHABLE_KEY = getRequiredEnvVar(
  `NEXT_PUBLIC_ROBOFLOW_PUBLISHABLE_KEY`
);
// https://docs.roboflow.com/deploy/sdks/web-browser
// https://universe.roboflow.com/brad-dwyer/oxford-pets
const MODEL_NAME = `oxford-pets`;
const MODEL_VERSION = 3;
const TIMEOUT = ms(`2 minutes`);

const retellWebClient = new RetellWebClient();

type ConversationStatus = `notStarted` | `loading` | `inProgress` | `ended`;

const log = (msg: string): void => {
  // eslint-disable-next-line no-console
  console.log(msg);
  const statusElem = document.getElementById(`status`);
  if (statusElem) {
    statusElem.innerText = msg;
  }
};

export default async (): Promise<void> => {
  log(`Loading...`);

  document.getElementById(`start-button`)?.remove();

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: `environment`,
    },
  });

  const model = await (window as any).roboflow
    .auth({
      publishable_key: NEXT_PUBLIC_ROBOFLOW_PUBLISHABLE_KEY,
    })
    .load({
      model: MODEL_NAME,
      version: MODEL_VERSION,
    });

  model.configure({
    threshold: 0.6,
    max_objects: 1,
  });

  const height = window.innerHeight;
  const width = window.innerWidth;

  const video = document.createElement(`video`);
  video.srcObject = stream;
  video.id = `video1`;
  video.setAttribute(`playsinline`, ``);
  video.play();
  video.height = height;
  video.style.height = `${height}px`;
  video.width = width;
  video.style.width = `${width}px`;
  document.body.appendChild(video);

  log(`Point your camera at your pet!`);

  const closeButton = document.getElementById(`close-button`);
  if (closeButton) {
    closeButton.style.display = `block`;
  }

  const state: {
    currentPet: `cat` | `dog` | null;
    numConsecutiveNullDetections: number;
    conversationStatus: ConversationStatus;
    conversationStartedAt: Date | null;
  } = {
    currentPet: null,
    numConsecutiveNullDetections: 0,
    conversationStatus: `notStarted`,
    conversationStartedAt: null,
  };

  retellWebClient.on(`conversationStarted`, () => {
    log(``);
    state.conversationStatus = `inProgress`;
  });
  retellWebClient.on(`conversationEnded`, () => {
    state.conversationStatus = `ended`;
  });
  retellWebClient.on(`error`, () => {
    toast.error(`Error`);
  });

  const startConversation = async (type: `cat` | `dog`): Promise<void> => {
    log(`Loading...`);
    state.conversationStatus = `loading`;

    const response = await fetch(`/api/register-call`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({ type }),
    });

    const dataJson = await response.json();
    const data = RegisterCallResponseSchema.parse(dataJson);

    await retellWebClient.startConversation({
      callId: data.call.id,
      sampleRate: data.call.sampleRate,
      enableUpdate: true,
    });

    log(``);
    state.conversationStartedAt = new Date();
  };

  const petDetected = (type: `cat` | `dog`): void => {
    state.numConsecutiveNullDetections = 0;
    if (state.currentPet === type) {
      return;
    }
    state.currentPet = type;
    if (state.conversationStatus === `notStarted`) {
      startConversation(type);
    }
  };

  const noPetDetected = (): void => {
    if (state.currentPet === null) {
      return;
    }
    state.numConsecutiveNullDetections += 1;

    if (state.numConsecutiveNullDetections > 60) {
      state.currentPet = null;
      state.numConsecutiveNullDetections = 0;
    }
  };

  video.addEventListener(
    `loadeddata`,
    function () {
      setInterval(function () {
        if (
          state.conversationStatus === `inProgress` &&
          state.conversationStartedAt &&
          new Date().getTime() - state.conversationStartedAt.getTime() > TIMEOUT
        ) {
          retellWebClient.stopConversation();
          state.conversationStatus = `ended`;
          log(`Time is up! Our pet translators are expensive...`);
          video.remove();
        }

        if (state.currentPet) {
          return;
        }

        model.detect(video).then((predictions: any) => {
          if (
            predictions.length > 0 &&
            predictions[0].class.startsWith(`cat-`)
          ) {
            petDetected(`cat`);
          } else if (
            predictions.length > 0 &&
            predictions[0].class.startsWith(`dog-`)
          ) {
            petDetected(`dog`);
          } else {
            noPetDetected();
          }
        });
      }, 500);
    },
    false
  );
};
