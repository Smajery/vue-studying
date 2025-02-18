import { ROUTES, NESTED_ROUTES } from '@/utils/types/router.types.js';
import TheBankStatementDetail from '@/pages/bank-statement/detail/TheBankStatementDetail.vue';
import TheBankStatementCharts from '@/pages/bank-statement/charts/TheBankStatementCharts.vue';

const routes = [
  {
    path: ROUTES.HOME,
    redirect: ROUTES.BANK_STATEMENT_DETAIL,
  },
  {
    path: ROUTES.BANK_STATEMENT,
    children: [
      { path: NESTED_ROUTES.DETAIL, component: TheBankStatementDetail },
      { path: NESTED_ROUTES.CHARTS, component: TheBankStatementCharts },
    ],
  },
];

export default routes;
