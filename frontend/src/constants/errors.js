export const ERRORS = {
  ATTRS: {
    FOR_ERRORS_CONTROL_NAME: 'data-for-errors-control-name',
  },
  EF001: (input) =>
    `Поле ${
      input.hasAttribute(ERRORS.ATTRS.FOR_ERRORS_CONTROL_NAME)
        ? `"${input.getAttribute(ERRORS.ATTRS.FOR_ERRORS_CONTROL_NAME)}" `
        : ''
    }не может быть пустым`,

  EF002: (input) =>
    `Поле ${
      input.hasAttribute(ERRORS.ATTRS.FOR_ERRORS_CONTROL_NAME)
        ? `"${input.getAttribute(ERRORS.ATTRS.FOR_ERRORS_CONTROL_NAME)}" `
        : ''
    }заполнено некорректно`,
};
