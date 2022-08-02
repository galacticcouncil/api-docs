import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

import {HomeController} from './home.ctrl';

import {baseStyles} from '../base.css';

@customElement('app-home')
export class Home extends LitElement {
  private home = new HomeController(this);

  static styles = [baseStyles];

  render() {
    return html`
      <div class="container">${JSON.stringify(this.home.data)}</div>
    `;
  }
}
