import { type Role } from '@prisma/client';
import { FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';
import { sessionModel } from '~/interface/application/session/model';

const SUPER_ROLES = [] satisfies Role[];

export function withGuard(
  Component: FunctionComponent,
  permissibleRoles: ExcludeStrict<Role, (typeof SUPER_ROLES)[number]>[],
  redirectTo?: RoutePath
) {
  return function RouteElement(props: Record<string, unknown>) {
    const session = sessionModel.session;

    if (!session?.role || !isAccessGranted(session.role, permissibleRoles)) {
      return <Navigate to={redirectTo || '/access-denied'} replace />;
    }

    return <Component {...props} />;
  };
}

function isAccessGranted(
  sessionRole: Role,
  permissibleRoles: ExcludeStrict<Role, (typeof SUPER_ROLES)[number]>[]
) {
  const allPermissibleRoles = [...SUPER_ROLES, ...permissibleRoles];
  return allPermissibleRoles.some((role) => role === sessionRole);
}
