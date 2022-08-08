import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {baseStyles} from '../base.css';

@customElement('app-header')
export class Header extends LitElement {
  @property({type: String})
  section = null;

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
        <h4>${this.section}</h4>
      </div>
    `;
  }
}
