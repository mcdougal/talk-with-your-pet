'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

import { Button, IconButton, Typography } from '@/app/components';

import start from './start';

const PetTalker = (): React.ReactElement => {
  return useMemo(() => {
    return (
      <>
        <canvas height="0" id="video-canvas" width="0" />
        <div
          className="mx-auto mt-[30vh] flex max-w-2xl flex-col items-center justify-center px-4 pb-20"
          id="start-button">
          <Button onClick={start} size="xl">
            🐱 Talk With Your Pet! 🐶
          </Button>
          <Typography className="mt-4 max-w-64" size="sm">
            1. Click the button
            <br />
            2. Point your camera at your pet
            <br />
            3. Talk!
          </Typography>
        </div>
        <span
          className="fixed left-0 top-0 z-50 w-full bg-white p-4 text-center"
          id="status"
        />
        <IconButton
          className="fixed right-0 top-0"
          icon={XMarkIcon}
          id="close-button"
          label="Stop talking"
          onClick={() => {
            window.location.reload();
          }}
          size="sm"
          style={{ display: `none` }}
        />
      </>
    );
  }, []);
};

export default PetTalker;
