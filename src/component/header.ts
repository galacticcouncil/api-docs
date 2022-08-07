import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

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

      .line {
        border-bottom: 1px solid var(--color-alternative);
      }
    `,
  ];

  render() {
    const classes = {
      header: true,
      line: this.section,
    };
    return html`
      <div class=${classMap(classes)}>
        <h4>${this.section}</h4>
      </div>
    `;
  }
}
