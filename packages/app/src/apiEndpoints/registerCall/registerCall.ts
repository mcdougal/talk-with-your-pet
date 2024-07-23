import { getRequiredEnvVar } from '@/common/env';
import { NextResponse } from 'next/server';
import { RetellClient } from 'retell-sdk';
import {
  AudioEncoding,
  AudioWebsocketProtocol,
} from 'retell-sdk/models/components';

import { RegisterCallResponse } from '@/app/apiTypes';

import { RouteHandler } from '../types';

const CAT_AGENT_ID = `d47cadfe2c77e79614d43963d2c7aa7e`;
const DOG_AGENT_ID = `a043dd325da1cfe2cd0e2844f5e4d31f`;

const retell = new RetellClient({
  apiKey: getRequiredEnvVar(`RETELLAI_API_KEY`),
});

type RouteParams = Record<string, never>;
type ResponseData = RegisterCallResponse;

export const POST: RouteHandler<
  RouteParams,
  ResponseData,
  'streaming'
> = async (request) => {
  const json = await request.json();
  const { type } = json;

  const res = await retell.registerCall({
    agentId: type === `cat` ? CAT_AGENT_ID : DOG_AGENT_ID,
    audioEncoding: AudioEncoding.S16le,
    audioWebsocketProtocol: AudioWebsocketProtocol.Web,
    sampleRate: 44100,
  });

  if (!res.callDetail) {
    return NextResponse.error();
  }

  return NextResponse.json({
    call: {
      id: res.callDetail.callId,
      sampleRate: res.callDetail.sampleRate,
    },
  });
};
