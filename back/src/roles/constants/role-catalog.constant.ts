import { Role } from '../../common/enums/role.enum';

export interface RoleCatalogEntry {
  seedOnBootstrap: boolean;
  allowSelfSignUp: boolean;
  requiresApproval: boolean;
}

export const ROLE_CATALOG: Record<Role, RoleCatalogEntry> = {
  [Role.User]: {
    seedOnBootstrap: true,
    allowSelfSignUp: true,
    requiresApproval: false,
  },
  [Role.Company]: {
    seedOnBootstrap: true,
    allowSelfSignUp: true,
    requiresApproval: false,
  },
  [Role.Operator]: {
    seedOnBootstrap: true,
    allowSelfSignUp: false,
    requiresApproval: false,
  },
  [Role.Admin]: {
    seedOnBootstrap: true,
    allowSelfSignUp: false,
    requiresApproval: false,
  },
  [Role.SuperAdmin]: {
    seedOnBootstrap: true,
    allowSelfSignUp: false,
    requiresApproval: false,
  },
};

const ROLE_CATALOG_ENTRIES = Object.entries(ROLE_CATALOG) as Array<
  [Role, RoleCatalogEntry]
>;

export const getSeedableRoles = (): Role[] => {
  return ROLE_CATALOG_ENTRIES
    .filter(([, entry]) => entry.seedOnBootstrap)
    .map(([role]) => role);
};

export const isSelfSignUpRole = (role: Role): boolean => {
  return ROLE_CATALOG[role].allowSelfSignUp;
};