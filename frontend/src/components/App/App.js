import './App.scss';

export class App {
  app = this.createApp();

  createApp() {
    const app = document.createElement('div');
    app.setAttribute('id', 'app');
    app.className = 'app';
    return app;
  }

  render() {
    document.querySelector('body').appendChild(this.app);
  }
}
