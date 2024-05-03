class Search {
  searchComponent = null;
  control = null;

  classNames = {
    control: 'liner-control__input',
  };

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
    this.control.addEventListener('input', (event) => {
      console.log(event.target.value);
    });
  }
}

export const search = new Search(document.querySelector('.header__search'));
