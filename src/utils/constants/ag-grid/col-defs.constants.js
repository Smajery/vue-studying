import {
  COL_DEFS_FIELD_NAMES,
  COL_DEFS_HEADER_NAMES,
} from '@/utils/types/ag-grid.types.js';

export const BANK_STATEMENT_COL_DEFS = [
  {
    headerName: COL_DEFS_HEADER_NAMES.COL_NUMBER,
    valueGetter: (params) => params.node.rowIndex + 1,
    width: 60,
    pinned: 'left',
  },
  { field: COL_DEFS_FIELD_NAMES.CATEGORY },
  { field: COL_DEFS_FIELD_NAMES.SUBCATEGORY },
  {
    field: COL_DEFS_FIELD_NAMES.AMOUNT,
    editable: true,
  },
  { field: COL_DEFS_FIELD_NAMES.CURRENCY },
  { field: COL_DEFS_FIELD_NAMES.COUNTRY },
  { field: COL_DEFS_FIELD_NAMES.MERCHANT },
  {
    field: COL_DEFS_FIELD_NAMES.PAYMENT_METHOD,
    headerName: COL_DEFS_HEADER_NAMES.PAYMENT_METHOD,
  },
  { field: COL_DEFS_FIELD_NAMES.STATUS },
  { field: COL_DEFS_FIELD_NAMES.DATE, flex: 1 },
];
