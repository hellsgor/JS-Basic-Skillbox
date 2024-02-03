import classes from './TextControl.module.scss';

import { createElement } from '@/src/helpers/create-element.js';

export class TextControl {
  control = null;
  attributes = {
    type: null,
    placeholder: null,
    name: null,
    disabled: false,
    required: false,
    id: null,
  };

  constructor(props) {
    this.attributes.type = props.type || 'text';
    this.attributes.placeholder = props.placeholder || null;
    this.attributes.name = props.name || null;
    this.attributes.disabled = props.disabled ?? false;
    this.attributes.required = props.required ?? false;
    this.attributes.id = props.id ?? null;
  }

  initControl() {
    this.control = createElement({
      tag: 'input',
      classes: classes['text-control'],
    });

    Object.entries(this.attributes).forEach((attribute) => {
      if (attribute[1]) {
        this.control.setAttribute(`${attribute[0]}`, `${attribute[1]}`);
      }
    });

    return this.control;
  }
}
