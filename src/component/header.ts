import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {baseStyles} from '../base.css';

@customElement('ui-header')
export class Header extends LitElement {
  @property({attribute: false})
  params = null;

  static styles = [
    baseStyles,
    css`
      .header {
        display: flex;
        align-items: center;
        height: var(--toolbar-height);
        padding: 0 16px;
      }
    `,
  ];

  render() {
    return html`
      <div class="header">
        ${when(this.params, () => html` <h3>${this.params.pallet}</h3>`)}
      </div>
    `;
  }
}
