import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {DatabaseController} from '../db.ctrl';
import {locationCursor} from '../db';
import {RouterLocation} from '@vaadin/router';

import {baseStyles} from '../base.css';

@customElement('ui-header')
export class Header extends LitElement {
  private db = new DatabaseController<RouterLocation>(
    this,
    locationCursor,
    this.localName
  );

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
        ${when(
          this.db.state.params,
          () => html` <h3>${this.db.state.params.pallet}</h3>`
        )}
      </div>
    `;
  }
}
