export class SearchNoResults {
  $block = null;
  $message = null;
  $button = null;

  blockClassName = 'no-search-result';
  classNames = {
    message: `${this.blockClassName}__message`,
    button: `${this.blockClassName}__button`,
    buttonText: 'button__text',
  };
  modifiers = {
    hidden: 'hidden',
  };

  defaultMessageText = 'Что-то пошло не так... Обратитесь к администратору';
  defaultButtonText = 'ok';

  constructor() {
    this.getElements();
  }

  getElements() {
    this.$block = document.getElementById('no-search-result');
    this.$message = this.$block.querySelector(`.${this.classNames.message}`);
    this.$button = this.$block.querySelector(`.${this.classNames.button}`);
  }

  show(messageText, buttonText) {
    this.$block.classList.remove(
      `${this.blockClassName}_${this.modifiers.hidden}`,
    );

    this.$message.innerText = messageText
      ? messageText
      : this.defaultMessageText;

    this.$button.querySelector(`.${this.classNames.buttonText}`).innerText =
      buttonText ? buttonText : this.defaultButtonText;
  }

  hide() {
    this.$block.classList.add(
      `${this.blockClassName}_${this.modifiers.hidden}`,
    );
  }
}
