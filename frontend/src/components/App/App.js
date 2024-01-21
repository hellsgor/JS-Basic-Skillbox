import './App.scss';
import header from '@components/header/';

class App {
  render() {
    console.log('app');
    header.render();
  }
}

const app = new App();
export default app;
