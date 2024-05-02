const selectClassName = 'select';

export const SELECTS = {
  CLASS_NAMES: {
    SELECT: selectClassName,
    BUTTON: `${selectClassName}__item`,
    BUTTON_TEXT: `${selectClassName}__item-text`,
    BUTTON_ARROW: `${selectClassName}__item-arrow`,
    DROPDOWN: `${selectClassName}__dropdown`,
    OPTION: `${selectClassName}__option`,
  },

  MODIFIERS: {
    OPENED: 'opened',
    SELECTED: 'selected',
    VISIBLE: 'visible',
    DISABLED: 'disabled',
  },

  ATTRS: {
    DATA_SELECTED_TYPE_VALUE: 'data-selected-value',
  },
};
