import { getRequiredEnvVar } from '@/common/env';

const CRON_SECRET = getRequiredEnvVar(`CRON_SECRET`);

/* eslint-disable no-console */
const run = async (jobName: string): Promise<void> => {
  console.log(
    `Starting job: http://localhost:3000/api/cron/${jobName} (see server logs for output)`
  );

  const result = await fetch(`http://localhost:3000/api/cron/${jobName}`, {
    method: `GET`,
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
      'Content-Type': `application/json`,
    },
  });

  if (result.ok) {
    console.log(`Job started`);
  } else {
    console.error(`Job failed to start: ${result.status} ${result.statusText}`);
  }
};

if (module === require.main) {
  const jobName = process.argv[2];

  if (!jobName) {
    console.error(`Please provide a job name`);
    process.exit(1);
  }

  run(jobName).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
