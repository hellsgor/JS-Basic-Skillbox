export function cloneTemplate(templateID) {
  return document.getElementById(templateID).content.cloneNode(true);
}
