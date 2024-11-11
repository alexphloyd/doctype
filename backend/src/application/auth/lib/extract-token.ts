import { Request } from 'express';

export function getBearerToken(request: Request): string | undefined {
  const [type, token] =
    (request?.headers as any)?.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function getOAuthToken(request: Request): string | undefined {
  return (request?.headers as any)?.oauth ?? '';
}

export function getRefreshToken(request: Request): string | undefined {
  return (request?.headers as any)?.refresh ?? '';
}
