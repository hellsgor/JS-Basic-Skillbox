export function createElement(props) {
  const element = document.createElement(props.tag);

  if (Array.isArray(props.classes)) {
    props.classes.forEach((classesItem) => {
      element.classList.add(classesItem);
    });
  }

  if (typeof props.classes === 'string') {
    element.className = props.classes;
  }

  if (props.text) {
    element.innerText = props.text;
  }

  if (props.html) {
    element.innerHTML = props.html;
  }

  if (props.attributes && Array.isArray(props.attributes)) {
    props.attributes.forEach((attr) => {
      element.setAttribute(attr[0], attr[1]);
    });
  }

  return element;
}
