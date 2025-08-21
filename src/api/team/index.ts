import { Router } from 'express';
import { createRoute } from '../utilities';
import teamCreate from './teamCreate';
import teamUpdate from './teamUpdate';
import teamDestroy from './teamDestroy';
import teamFind from './teamFind';
import teamList from './teamList';
import teamAutocomplete from './teamAutocomplete';
import teamCount from './teamCount';
import teamImport from './teamImport';
import teamAddMember from './teamAddMember';
import teamRemoveMember from './teamRemoveMember';
import teamUpdateInvitation from './teamUpdateInvitation';
import Permissions from '../../security/permissions';

export default (app: Router) => {
  createRoute(
    app,
    'post',
    '/team',
    {
      auth: true,
      permission: Permissions.values.teamCreate,
    },
    teamCreate,
  );
  createRoute(
    app,
    'put',
    '/team/:id',
    {
      auth: true,
      permission: Permissions.values.teamEdit,
    },
    teamUpdate,
  );
  createRoute(
    app,
    'delete',
    '/team',
    {
      auth: true,
      permission: Permissions.values.teamDestroy,
    },
    teamDestroy,
  );
  createRoute(
    app,
    'get',
    '/team/autocomplete',
    {
      auth: true,
      permission: Permissions.values.teamAutoComplete,
    },
    teamAutocomplete,
  );
  createRoute(
    app,
    'get',
    '/team/count',
    {
      auth: true,
      permission: Permissions.values.teamRead,
    },
    teamCount,
  );
  createRoute(
    app,
    'get',
    '/team/:id',
    {
      auth: true,
      permission: Permissions.values.teamRead,
    },
    teamFind,
  );
  createRoute(
    app,
    'get',
    '/team',
    {
      auth: true,
      permission: Permissions.values.teamRead,
    },
    teamList,
  );

  createRoute(
    app,
    'post',
    '/team/import',
    {
      auth: true,
      permission: Permissions.values.teamImport,
    },
    teamImport,
  );
  createRoute(
    app,
    'post',
    '/team/:id/member',
    {
      auth: true,
      permission: Permissions.values.teamEdit,
    },
    teamAddMember,
  );
  createRoute(
    app,
    'delete',
    '/team/:id/member',
    {
      auth: true,
      permission: Permissions.values.teamEdit,
    },
    teamRemoveMember,
  );
  createRoute(
    app,
    'patch',
    '/team/:teamId/member/:memberId/invitation',
    {
      auth: true,
      permission: Permissions.values.teamEdit,
    },
    teamUpdateInvitation,
  );
};
