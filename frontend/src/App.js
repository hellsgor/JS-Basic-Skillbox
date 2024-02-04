import './App.scss';
import { Header } from '@/src/modules/Header/Header.js';
import { createElement } from '@/src/helpers/create-element.js';
import { Clients } from '@/src/modules/Clients/Clients.js';

export class App {
  header = null;
  clients = null;

  elements = {};

  constructor() {
    this.header = new Header();
    this.clients = new Clients();

    this.elements.body = document.querySelector('body');
    this.elements.header = this.header.initHeader();
    this.elements.clients = this.clients.initClients();
  }

  render() {
    this.elements.body.appendChild(this.elements.header);

    this.elements.main = createElement({ tag: 'main' });
    this.elements.body.appendChild(this.elements.main);

    this.elements.main.appendChild(this.elements.clients);
  }
}
