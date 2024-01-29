import './App.scss';

import header from '@components/Header/Header';

export class App {
  app = this.createApp();

  createApp() {
    const app = document.createElement('div');
    app.setAttribute('id', 'app');
    app.className = 'app';

    return app;
  }

  render() {
    this.app.appendChild(header.createHeader());
    document.querySelector('body').appendChild(this.app);
  }
}
