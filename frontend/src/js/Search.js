import { debouncer } from '@/js/Debouncer.js';
import { clientsTable } from '@/js/ClientsTable.js';
import clientsApi from '@api/Clients-api.js';

class Search {
  searchComponent = null;
  control = null;

  classNames = {
    control: 'liner-control__input',
  };
  controlInputHandler = debouncer.debounce(this.getSearchResult, 300);

  constructor(searchComponent) {
    this.searchComponent = searchComponent || null;
  }

  init() {
    this.getElements();
    this.addListeners();
  }

  getElements() {
    this.control = this.searchComponent.querySelector(
      `.${this.classNames.control}`,
    );
  }

  addListeners() {
    this.control.addEventListener('input', this.controlInputHandler);
  }

  async getSearchResult({ target }) {
    await clientsTable
      .initClients(null, clientsApi.searchClients, {
        searchString: target.value,
      })
      .then(() => clientsTable.renderClients());
  }
}

export const search = new Search(document.querySelector('.header__search'));
