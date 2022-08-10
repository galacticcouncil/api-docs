import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {baseStyles} from '../base.css';

@customElement('app-header')
export class Header extends LitElement {
  @property({type: String})
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

      .breadcrumbs {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    `,
  ];

  render() {
    return html`
      <div class="header">
        ${when(
          this.params,
          () => html` <div class="breadcrumbs">
            <h4>${this.params.pallet}</h4>
          </div>`
        )}
      </div>
    `;
  }
}
