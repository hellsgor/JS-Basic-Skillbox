import classes from './Header.module.scss';

class Header {
  createHeader() {
    const header = document.createElement('header');
    header.className = classes.header;

    header.innerHTML = `
      <div class="${classes.header__logo}">skb.</div>
    `;

    return header;
  }
}

const header = new Header();
export default header;
