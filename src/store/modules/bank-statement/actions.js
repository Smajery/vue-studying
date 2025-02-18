import { ACTIONS, MUTATIONS } from '@/utils/types/store.types.js';
import { PATHS } from '@/utils/types/fetch.types.js';
import ErrorHandler from '@/utils/handlers/ErrorHandler.js';

export default {
  async [ACTIONS.LOAD_BANK_STATEMENT]({ commit }) {
    try {
      const response = await fetch(PATHS.BANK_STATEMENT);
      const data = await response.json();
      commit(MUTATIONS.SET_BANK_STATEMENT, data);
    } catch (err) {
      ErrorHandler.log(err);
    }
  },
};
