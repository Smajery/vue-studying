export default {
  fullBankStatement: (state) => state.bankStatement,
  categoriesWithTotal: (state) => (categoryName) => {
    return state.bankStatement.reduce((acc, statement) => {
      acc[statement[categoryName]] =
        (acc[statement[categoryName]] || 0) + statement.amount;
      return acc;
    }, {});
  },
  totalAmount: (state) =>
    state.bankStatement.reduce((acc, statement) => acc + statement.amount, 0),
};
