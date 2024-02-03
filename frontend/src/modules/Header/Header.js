import { createElement } from '@/src/helpers/create-element.js';
import classes from './Header.module.scss';
import { Logo } from '@/src/ui/Logo/Logo.js';

class Header {
  createHeader() {
    this.createBasicHeaderElements();

    const logo = new Logo();
    this.wrapper.appendChild(logo.createLogo());

    this.insertBasicHeaderElements();
    document.querySelector('body').appendChild(this.header);
  }

  createBasicHeaderElements() {
    this.header = createElement({
      tag: 'header',
      classes: classes.header,
    });

    this.container = createElement({
      tag: 'div',
      classes: classes.header__container,
    });

    this.wrapper = createElement({
      tag: 'div',
      classes: classes.header__wrapper,
    });
  }

  insertBasicHeaderElements() {
    this.container.appendChild(this.wrapper);
    this.header.appendChild(this.container);
  }
}

export function initHeader() {
  const header = new Header();
  header.createHeader();
  return header;
}
