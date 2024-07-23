import { StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export type RouteHandler<
  P,
  R,
  T extends 'default' | 'streaming' = 'default',
> = (
  request: NextRequest,
  params: { params: P }
) => Promise<T extends 'streaming' ? StreamingTextResponse : NextResponse<R>>;
