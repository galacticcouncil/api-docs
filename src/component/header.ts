import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
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

  @property({attribute: false})
  assets = [];

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
          this.db.state.pathname !== '/',
          () => html`
            <h3>${this.db.state.params.pallet}</h3>
            <span class="grow"></span>
            <ui-search .assets=${this.assets}></ui-search>
          `
        )}
      </div>
    `;
  }
}
