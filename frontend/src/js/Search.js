import { debouncer } from '@/js/Debouncer.js';
import { clientsTable } from '@/js/ClientsTable.js';
import clientsApi from '@api/Clients-api.js';
import { SearchNoResults } from '@/js/SearchNoResults.js';

class Search {
  $searchComponent = null;
  $control = null;

  searchNoResult = null;

  classNames = {
    control: 'liner-control__input',
  };

  timeout = 300;
  controlInputHandler = debouncer.debounce(
    this.controlInputHandlerMethod.bind(this),
    this.timeout,
  );

  constructor(searchComponent) {
    this.$searchComponent = searchComponent || null;
  }

  init() {
    this.getElements();
    this.searchNoResult = new SearchNoResults();
    this.addListeners();
  }

  getElements() {
    this.$control = this.$searchComponent.querySelector(
      `.${this.classNames.control}`,
    );
  }

  addListeners() {
    this.$control.addEventListener('input', this.controlInputHandler);
  }

  controlInputHandlerMethod({ target }) {
    if (target.value) {
      this.getSearchResult({ target }).then(() => {
        if (!clientsTable.clients.length) {
          this.noResultsHandler(target.value);
        }
      });
    } else {
      this.searchNoResult.hide();
      clientsTable.initClients(null, null).then(() => {
        clientsTable.renderClients();
      });
    }
  }

  async getSearchResult({ target }) {
    await clientsTable
      .initClients(null, clientsApi.searchClients, {
        searchString: target.value,
      })
      .then(() => {
        if (clientsTable.clients.length) {
          clientsTable.renderClients();
        }
      });
  }

  noResultsHandler(query) {
    clientsTable.hidePreloader();
    this.searchNoResult.show(
      `Клиенты по запросу "${query}" не найдены. Попробуйте другой запрос`,
      'Сбросить поиск',
    );
  }
}

export const search = new Search(document.querySelector('.header__search'));
