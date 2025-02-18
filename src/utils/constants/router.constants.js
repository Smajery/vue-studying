import { NAMES, NESTED_ROUTES, ROUTES } from '@/utils/types/router.types.js';

const PUBLIC_ROUTES = [
  {
    name: NAMES.BANK_STATEMENT,
    path: ROUTES.BANK_STATEMENT + '/' + NESTED_ROUTES.DETAIL,
  },
  {
    name: NAMES.CHARTS,
    path: ROUTES.BANK_STATEMENT + '/' + NESTED_ROUTES.CHARTS,
  },
];

export default PUBLIC_ROUTES;
