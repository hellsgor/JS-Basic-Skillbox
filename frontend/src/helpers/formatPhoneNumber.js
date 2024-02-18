import { regexps } from '@/constants/regexps.js';

export function formatPhoneNumber(phoneNumber) {
  return phoneNumber.replace(regexps.PHONE_NUMBER, '$1 ($2) $3-$4-$5');
}
