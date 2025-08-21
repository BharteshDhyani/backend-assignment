import Roles from './roles';
import Plans from './plans';

export type Permission = {
  id: string;
  allowedRoles: string[];
  allowedPlans: string[];
  allowedStorage?: { id: string }[];
};

type PermissionKey =
  | 'teamCreate'
  | 'teamRead'
  | 'teamDestroy'
  | 'teamEdit'
  | 'teamImport'
  | 'teamAutoComplete'
  | 'templateImport'
  | 'templateCreate'
  | 'templateEdit'
  | 'templateDestroy'
  | 'templateRead'
  | 'templateAutocomplete';

const roles = Roles.values;
const plans = Plans.values;

class Permissions {
  static get values(): Record<PermissionKey, Permission> {
    return {
      teamCreate: {
        id: 'teamCreate',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      teamRead: {
        id: 'teamRead',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      teamDestroy: {
        id: 'teamDestroy',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      teamEdit: {
        id: 'teamEdit',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      teamImport: {
        id: 'teamImport',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      teamAutoComplete: {
        id: 'teamAutoComplete',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      templateImport: {
        id: 'templateImport',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      templateCreate: {
        id: 'templateCreate',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
        allowedStorage: [],
      },
      templateEdit: {
        id: 'templateEdit',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
        allowedStorage: [],
      },
      templateDestroy: {
        id: 'templateDestroy',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
        allowedStorage: [],
      },
      templateRead: {
        id: 'templateRead',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      templateAutocomplete: {
        id: 'templateAutocomplete',
        allowedRoles: [roles.user],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
    };
  }

  static get asArray() {
    return Object.keys(this.values).map((value) => {
      return this.values[value as PermissionKey];
    });
  }
}

export default Permissions;
