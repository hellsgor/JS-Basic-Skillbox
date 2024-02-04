import { createElement } from '@/src/helpers/create-element.js';
import classes from './Header.module.scss';
import { Logo } from '@/src/ui/Logo/Logo.js';
import { TextControl } from '@/src/ui/controls/TextControl/TextControl.js';

export class Header {
  initHeader() {
    this.createBasicHeaderElements();

    this.initLogo();
    this.initSearchControl({
      type: 'text',
      placeholder: 'Введите запрос',
      name: 'header-search-control',
      id: 'header-search-control',
    });

    this.insertBasicHeaderElements();

    return this.header;
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

  initLogo() {
    const logo = new Logo();
    this.wrapper.appendChild(logo.createLogo());
  }

  initSearchControl(props) {
    const searchControl = new TextControl(props);
    this.searchControl = searchControl.initControl();
    this.searchControl.classList.add(classes.header__search);
    this.wrapper.appendChild(this.searchControl);
  }
}
