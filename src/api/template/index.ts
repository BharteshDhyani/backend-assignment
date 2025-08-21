import { Router } from 'express';
import { createRoute } from '../utilities';
import templateCreate from './templateCreate';
import templateUpdate from './templateUpdate';
import templateImport from './templateImport';
import templateDestroy from './templateDestroy';
import templateAutocomplete from './templateAutocomplete';
import templateCount from './templateCount';
import templateList from './templateList';
import templateFind from './templateFind';
import Permissions from '../../security/permissions';

export default (app: Router) => {
  createRoute(
    app,
    'post',
    '/template',
    {
      auth: true,
      permission: Permissions.values.templateCreate,
    },
    templateCreate,
  );
  createRoute(
    app,
    'put',
    '/template/:id',
    {
      auth: true,
      permission: Permissions.values.templateEdit,
    },
    templateUpdate,
  );
  createRoute(
    app,
    'post',
    '/template/import',
    {
      auth: true,
      permission: Permissions.values.templateImport,
    },
    templateImport,
  );
  createRoute(
    app,
    'delete',
    '/template',
    {
      auth: true,
      permission: Permissions.values.templateDestroy,
    },
    templateDestroy,
  );
  createRoute(
    app,
    'get',
    '/template/autocomplete',
    {
      auth: true,
      permission: Permissions.values.templateAutocomplete,
    },
    templateAutocomplete,
  );
  createRoute(
    app,
    'get',
    '/template/count',
    {
      auth: true,
      permission: Permissions.values.templateRead,
    },
    templateCount,
  );
  createRoute(
    app,
    'get',
    '/template',
    {
      auth: true,
      permission: Permissions.values.templateRead,
    },
    templateList,
  );
  createRoute(
    app,
    'get',
    '/template/:id',
    {
      auth: true,
      permission: Permissions.values.templateRead,
    },
    templateFind,
  );
};
