import { Request } from 'express';

export function extractAuthTokenFromHeader(
  request: Request
): string | undefined {
  const [type, token] =
    (request?.headers as any)?.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function extractOAuthTokenFromHeader(
  request: Request
): string | undefined {
  return (request?.headers as any)?.oauth ?? '';
}

export function extractRefreshTokenFromHeader(
  request: Request
): string | undefined {
  return (request?.headers as any)?.refresh ?? '';
}
