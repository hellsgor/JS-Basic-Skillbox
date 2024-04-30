export const regexps = {
  EXTRACT_PATH_WITHOUT_EXTENSION: /\/([^\/]+)(\.[^\/]+)?$/,
  PHONE_NUMBER: /^(?:\+\d{11}|\d{11})$/,
  CONVERTING_PHONE_NUMBER: /^(\+\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SURNAME: /^([А-ЯЁ][а-яё]{1,24}-[А-ЯЁ][а-яё]{1,23}|[А-ЯЁ][а-яё]{1,49})$/,
  NAME_OR_PATRONYMIC: /^[А-ЯЁ][а-яё]{1,49}$/,
};
