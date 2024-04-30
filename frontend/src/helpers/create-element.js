export function createElement(props) {
  const element = document.createElement(props.tag);

export function createElement({
  tag,
  classes,
  text,
  html,
  attributes,
  callback,
  event,
}) {
  const element = document.createElement(tag);

  if (Array.isArray(classes)) {
    classes.forEach((classesItem) => {
      element.classList.add(classesItem);
    });
  }

  if (typeof classes === 'string') {
    element.className = classes;
  }

  if (text) {
    element.innerText = text;
  }

  if (html) {
    element.innerHTML = html;
  }

  if (attributes && Array.isArray(attributes)) {
    attributes.forEach((attr) => {
      element.setAttribute(attr.name, attr.value);
    });
  }

  if (callback) {
    element.addEventListener(event ? event : 'click', callback);
  }

  return element;
}
