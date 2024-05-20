import { CONTACTS } from '@/constants/contacts.js';

class Sort {
  sortedContactsTypes = null;

  constructor() {
    this.sortedContactsTypes = this.sortContactsTypes();
  }

  /**
   * @description Сортирует контакты клиента
   * */
  sortContacts(clientData) {
    return (clientData.contacts = this.sortedContactsTypes.flatMap((type) =>
      clientData.contacts.filter((contact) => contact.type === type.text),
    ));
  }

  /**
   * @description Сортирует типы контактов в соответствии с их порядком сортировки и возвращает отсортированный массив объектов.
   * @returns {Object[]} - Отсортированный массив объектов типов контактов.
   */
  sortContactsTypes() {
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
}

export const sort = new Sort();
