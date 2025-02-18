import { MUTATIONS } from '@/utils/types/store.types.js';

export default {
  [MUTATIONS.SET_BANK_STATEMENT](state, bankStatement) {
    state.bankStatement = bankStatement;
  },
  [MUTATIONS.UPDATE_AMOUNT](state, { transactionId, newAmount }) {
    const index = state.bankStatement.findIndex(
      (item) => item.transaction_id === transactionId,
    );
    if (index !== -1) {
      state.bankStatement[index].amount = newAmount;
    }
  },
};
