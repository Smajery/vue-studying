import { useStore } from 'vuex';
import { BANK_STATEMENT_STORE } from '@/utils/types/store.types.js';
import ErrorHandler from '@/utils/handlers/ErrorHandler.js';
import { computed } from 'vue';

export function useBankStatement() {
  const store = useStore();

  const bankStatement = computed(
    () => store.getters[BANK_STATEMENT_STORE.FULL_STATEMENT],
  );

  const loadBankStatement = async () => {
    try {
      await store.dispatch(BANK_STATEMENT_STORE.LOAD_FULL_STATEMENT);
    } catch (err) {
      new ErrorHandler.log(err);
    }
  };

  return { loadBankStatement, bankStatement };
}
