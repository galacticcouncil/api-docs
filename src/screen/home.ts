import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

import {baseStyles} from '../base.css';

@customElement('app-home')
export class Home extends LitElement {
  static styles = [baseStyles];

  render() {
    return html` <div class="container">Home</div> `;
  }
}
