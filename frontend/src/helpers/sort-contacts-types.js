import { CONTACTS } from '@/constants/contacts.js';

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
    }));
}
