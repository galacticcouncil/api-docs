import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {baseStyles} from '../../../base.css';
import {detailStyles} from '../detail.css';

@customElement('app-const')
export class Const extends LitElement {
  @property({attribute: false})
  item = null;

  static styles = [baseStyles, detailStyles];

  render() {
    return html` ${when(
      this.item,
      () => html`
        <div class="detail">
          <h1>${this.item.name}</h1>
          <div class="doc">${this.item.doc}</div>
          <pre>${this.item.name}: ${this.item.type}</pre>
        </div>
      `
    )}`;
  }
}
