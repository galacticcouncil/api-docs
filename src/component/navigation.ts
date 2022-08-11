import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {DatabaseController} from '../db.ctrl';
import {locationCursor} from '../db';
import {RouterLocation} from '@vaadin/router';

import {baseStyles} from '../base.css';

import {PalletDoc} from '../polka/pallet';

@customElement('ui-navigation')
export class Navigation extends LitElement {
  private db = new DatabaseController<RouterLocation>(
    this,
    locationCursor,
    this.localName
  );

  @property({attribute: false})
  data = {pallets: [], chain: null, version: null, loaded: false};

  static styles = [
    baseStyles,
    css`
      .navigation {
        position: fixed;
        top: 0;
        z-index: 1200;
        height: 100%;
        width: var(--drawer-width);
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        transition: width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
        background: var(--color-alternative);
      }

      .navigation:hover {
        overflow-y: scroll;
      }

      .toolbar {
        min-height: var(--toolbar-height);
        display: flex;
        align-items: center;
        padding: 0 16px;
        position: sticky;
        top: 0;
        background-color: var(--color-alternative);
        z-index: 1;
        opacity: 0.95;
      }

      .toolbar img {
        height: 34px;
      }

      .toolbar div {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
      }

      .toolbar span {
        line-height: normal;
      }

      .toolbar .chain {
        font-size: 12px;
        line-height: 1.2;
      }

      .toolbar .label {
        font-weight: 600;
        font-size: 14px;
      }

      .menu {
        display: flex;
        flex-direction: column;
      }

      .menu .category {
        padding: 8px 16px;
        font-weight: 600;
        line-height: 1.5;
        text-transform: uppercase;
        position: sticky;
        background: var(--color-alternative);
        color: var(--color-secondary);
      }

      .menu .category:first-of-type {
        top: var(--toolbar-height);
      }

      .menu .category:nth-child(n + 2) {
        top: calc(37px + var(--toolbar-height));
      }

      .menu .items {
        display: flex;
        flex-direction: column;
      }

      .menu .items > a {
        padding: 4px 16px 4px 24px;
        cursor: pointer;
      }

      .menu .items > a.selected {
        background-color: #fff;
        border-left: 5px solid var(--color-secondary);
        border-right: 2px solid var(--color-alternative);
      }

      .menu .items > a.selected > span {
        margin-left: -5px;
        color: var(--color-secondary);
        font-weight: 600;
      }

      .menu .items > a:hover {
        color: var(--color-secondary);
      }
    `,
  ];

  render() {
    return html`
      <div class="navigation">
        <div class="toolbar">
          <a href="">
            <img src="assets/img/logo/basilisk.svg" />
          </a>
          <div>
            <span class="label">API Doc</span>
            <span class="chain">${this.data.chain}: ${this.data.version}</span>
          </div>
          <span class="grow"></span>
        </div>
        <div class="menu">
          <span class="category">Pallets</span>
          <div class="items">
            ${this.data.pallets.map((item: PalletDoc) => {
              const itemClasses = {
                selected:
                  this.db.state.params &&
                  this.db.state.params.pallet === item.name,
              };
              return html`
                <a class=${classMap(itemClasses)} href="pallets/${item.name}"
                  ><span> ${item.name} </span>
                </a>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }
}
