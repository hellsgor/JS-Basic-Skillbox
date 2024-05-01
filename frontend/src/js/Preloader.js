export class Preloader {
  modifiers = {
    hidden: 'hidden',
  };

  constructor() {}

  show({ element, className }) {
    element.classList.remove(`${className}_${this.modifiers.hidden}`);
  }

  hide({ element, className }) {
    element.classList.add(`${className}_${this.modifiers.hidden}`);
  }
}

export const preloader = new Preloader();
