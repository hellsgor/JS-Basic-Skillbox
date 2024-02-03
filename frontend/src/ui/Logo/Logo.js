import { createElement } from '@/src/helpers/create-element.js';
import classes from './Logo.module.scss';

export class Logo {
  createLogo() {
    const logo = createElement({ tag: 'div', classes: classes.logo });
    logo.appendChild(
      createElement({
        tag: 'span',
        classes: classes.logo__text,
        text: 'skb.',
      }),
    );
    return logo;
  }
}
