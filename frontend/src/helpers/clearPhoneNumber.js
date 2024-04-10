export function clearPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/[^\d+]/g, '');
}
