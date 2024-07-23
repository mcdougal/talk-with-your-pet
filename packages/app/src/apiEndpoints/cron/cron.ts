import { getRequiredEnvVar } from '@/common/env';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { RouteHandler } from '../types';

const CRON_SECRET = getRequiredEnvVar(`CRON_SECRET`);

type RouteParams = {
  jobName: string;
};

type ResponseData = {
  success: true;
};

export const GET: RouteHandler<RouteParams, ResponseData> = async (
  request,
  { params }
) => {
  const headersList = headers();
  const authHeader = headersList.get(`authorization`);

  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new NextResponse(`Unauthorized`, { status: 401 });
  }

  const { jobName } = params;

  return new NextResponse(`Job ${jobName} not found`, { status: 404 });
  // return NextResponse.json({ success: true });
};
