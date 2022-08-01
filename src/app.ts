import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('app-root')
export class App extends LitElement {
  static styles = css``;

  render() {
    return html`
      <header></header>
      <main>
        <slot></slot>
      </main>
      <footer></footer>
    `;
  }
}
