import { createElement } from '@/src/helpers/create-element.js';
import classes from './Header.module.scss';

class Header {
  createHeader() {
    const header = createElement({
      tag: 'header',
      classes: classes.header,
    });
    this.container = createElement({
      tag: 'div',
      classes: classes.header__container,
    });

    this.container.appendChild(
      createElement({
        tag: 'div',
        classes: classes.header__wrapper,
      }),
    );

    header.appendChild(this.container);
    document.querySelector('body').appendChild(header);
  }
}

export function initHeader() {
  const header = new Header();
  header.createHeader();
  return header;
}
