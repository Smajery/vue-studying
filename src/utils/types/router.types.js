const BANK_STATEMENT_ROUTE = '/bank-statement';

export const NESTED_ROUTES = {
  CHARTS: 'charts',
  DETAIL: 'detail',
};

export const ROUTES = {
  HOME: '/',
  BANK_STATEMENT: BANK_STATEMENT_ROUTE,
  BANK_STATEMENT_DETAIL: `${BANK_STATEMENT_ROUTE}/${NESTED_ROUTES.DETAIL}`,
  BANK_STATEMENT_CHARTS: `${BANK_STATEMENT_ROUTE}/${NESTED_ROUTES.CHARTS}`,
};

export const NAMES = {
  BANK_STATEMENT: 'Bank statement',
  CHARTS: 'Charts',
};
