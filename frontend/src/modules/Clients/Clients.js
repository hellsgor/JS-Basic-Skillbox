import { createElement } from '@/src/helpers/create-element.js';
import classes from './Clients.module.scss';

class Clients {
  createClients() {
    this.createBasicClientsElements();

    this.insertBasicClientsElements();
    return this.clients;
  }

  createBasicClientsElements() {
    this.clients = createElement({
      tag: 'div',
      classes: classes.clients,
    });

    this.container = createElement({
      tag: 'div',
      classes: classes.clients__container,
    });

    this.wrapper = createElement({
      tag: 'div',
      classes: classes.clients__wrapper,
    });
  }

  insertBasicClientsElements() {
    this.container.appendChild(this.wrapper);
    this.clients.appendChild(this.container);
  }
}

export function initClients() {
  const clients = new Clients();
  return clients.createClients();
}
