import { CONTACTS } from '@/constants/contacts.js';

/**
 * @description Сортирует типы контактов в соответствии с их порядком сортировки и возвращает отсортированный массив объектов.
 * @returns {Object[]} - Отсортированный массив объектов типов контактов.
 */

export function sortContactsTypes() {
  return Object.values(CONTACTS.TYPES)
    .sort((a, b) => {
      if (a.sortIndex === null && b.sortIndex === null) {
        return 0;
      } else if (a.sortIndex === null) {
        return 1;
      } else if (b.sortIndex === null) {
        return -1;
      } else {
        return a.sortIndex - b.sortIndex;
      }
    })
    .map((contactType) => ({
      sortIndex: contactType.sortIndex,
      text: contactType.text,
      value: contactType.value,
    }));
}
