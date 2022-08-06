import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {baseStyles} from '../../base.css';

import {PalletDoc} from '../../metadata/pallet';

@customElement('app-navigation')
export class Navigation extends LitElement {
  @property({attribute: false})
  pallets = [];

  @property({attribute: false})
  chain = null;

  @property({attribute: false})
  version = null;

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
        overflow-y: auto;
        transition: width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
        background: var(--drawer-background);
      }

      .toolbar {
        min-height: var(--toolbar-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        position: sticky;
        top: 0;
        background-color: var(--drawer-background);
        z-index: 1;
        opacity: 0.95;
      }

      .toolbar img {
        height: 34px;
      }
      .toolbar div {
        display: flex;
        flex-direction: column;
        text-align: right;
      }

      .toolbar span {
        font-size: 12px;
        line-height: 1.2;
      }

      .menu {
        display: flex;
        flex-direction: column;
      }

      .menu .category {
        padding: 8px 16px;
        font-weight: 400;
        line-height: 1.5;
        text-transform: uppercase;
        position: sticky;
        background: var(--drawer-background);
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

      .menu .items > a:hover {
        color: var(--color-secondary);
      }
    `,
  ];

  render() {
    return html`
      <div class="navigation">
        <div class="toolbar">
          <a href="/">
            <img src="/assets/img/logo/basilisk.svg" />
          </a>
          <div>
            <span>${this.chain}</span>
            <span>${this.version.split(' ')[0]}</span>
          </div>
        </div>
        <div class="menu">
          <span class="category">Pallets</span>
          <div class="items">
            ${this.pallets.map((item: PalletDoc) => {
              return html` <a class=""> ${item.name} </a> `;
            })}
          </div>
          <span class="category">RPC Calls</span>
        </div>
      </div>
    `;
  }
}
