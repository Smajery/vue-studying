import { createStore } from 'vuex';
import bankStatementModule from '@/store/modules/bank-statement/index.js';

const store = createStore({
  modules: {
    bankStatement: bankStatementModule,
  },
  state() {
    return {};
  },
});

export default store;
