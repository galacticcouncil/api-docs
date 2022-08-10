import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {baseStyles} from '../base.css';

import {PalletDoc} from '../polka/pallet';

@customElement('app-navigation')
export class Navigation extends LitElement {
  @property({type: String})
  section = null;

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
        justify-content: space-between;
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

  updateHeader(id: string) {
    const options = {
      bubbles: true,
      composed: true,
      detail: {id: id},
    };
    this.dispatchEvent(new CustomEvent('update-header', options));
  }

  render() {
    return html`
      <div class="navigation">
        <div class="toolbar">
          <a href="" @click=${() => this.updateHeader('')}>
            <img src="assets/img/logo/basilisk.svg" />
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
              const itemClasses = {
                selected: this.section === item.name,
              };
              return html`
                <a
                  class=${classMap(itemClasses)}
                  href="pallets/${item.name}"
                  @click=${() => this.updateHeader(item.name)}
                  ><span> ${item.name} </span>
                </a>
              `;
            })}
          </div>
          <span class="category">RPC Calls</span>
        </div>
      </div>
    `;
  }
}
