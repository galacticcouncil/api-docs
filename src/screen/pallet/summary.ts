import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {BeforeEnterObserver, RouterLocation} from '@vaadin/router';

import {DatabaseController} from '../../db.ctrl';
import {listStorage, StorageDoc} from '../../polka/meta/storage';
import {listExtrinsics, ExtrinsicDoc} from '../../polka/meta/extrinsic';
import {listConst, ConstDoc} from '../../polka/meta/const';

import {baseStyles} from '../../base.css';

@customElement('app-pallet-summary')
export class PalletSummary extends LitElement implements BeforeEnterObserver {
  private db = new DatabaseController(this, this.localName);

  @property({type: String})
  pallet = null;

  @property({type: Boolean})
  loaded = false;

  @property({attribute: false})
  storage = [];

  @property({attribute: false})
  extrinsics = [];

  @property({attribute: false})
  const = [];

  static styles = [
    baseStyles,
    css`
      .pallet {
        display: grid;
        grid-template-columns: 600px 1fr;
        grid-template-areas:
          'toolbar toolbar'
          'menu .';
      }

      .toolbar {
        grid-area: toolbar;
        height: 50px;
        border-bottom: 1px solid var(--color-alternative);
        padding: 0 12px 0 7px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .menu {
        grid-area: menu;
        border-right: 1px solid var(--color-alternative);
        height: calc(100vh - var(--toolbar-height) - 51px);
        overflow-y: auto;
        position: relative;
      }

      .menu .category {
        padding: 4px 16px;
        font-weight: 600;
        line-height: 1.5;
        text-transform: uppercase;
        position: sticky;
        color: var(--color-main);
        background-color: var(--color-alternative);
      }

      .menu .category {
        top: 0;
      }

      .menu .items {
        display: flex;
        flex-direction: column;
      }

      .menu .items > a {
        padding: 4px 16px 4px 24px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .menu .items > a:not(:last-child) {
        border-bottom: 1px solid var(--color-alternative);
      }

      .menu .items > a:hover {
        background-color: var(--color-alternative);
      }

      .info {
        padding: 40px 60px;
        max-width: 750px;
        display: flex;
        flex-direction: column;
      }
    `,
  ];

  async onBeforeEnter(location: RouterLocation) {
    this.pallet = location.params.id as string;
  }

  async updated() {
    if (this.db.state.ready && !this.loaded) {
      this.loaded = true;
      this.storage = listStorage(this.db.state.apiState.api, this.pallet);
      this.extrinsics = listExtrinsics(this.db.state.apiState.api, this.pallet);
      this.const = listConst(this.db.state.apiState.api, this.pallet);
    }
  }

  render() {
    return html`
      <div class="pallet">
        <div class="toolbar"></div>
        <div class="menu">
          ${when(
            this.loaded && this.storage.length,
            () => html`
              <div class="category">Storage</div>
              <div class="items">
                ${this.storage.map((item: StorageDoc) => {
                  return html`
                    <a href=""> ${item.name}(${item.input}): ${item.output}</a>
                  `;
                })}
              </div>
            `
          )}
          ${when(
            this.loaded && this.extrinsics.length,
            () => html`
              <div class="category">Extrinsics</div>
              <div class="items">
                ${this.extrinsics.map((item: ExtrinsicDoc) => {
                  return html` <a href=""> ${item.name}(${item.input}) </a> `;
                })}
              </div>
            `
          )}
          ${when(
            this.loaded && this.const.length,
            () => html`
              <div class="category">Const</div>
              <div class="items">
                ${this.const.map((item: ConstDoc) => {
                  return html` <a href=""> ${item.name}: ${item.type}</a> `;
                })}
              </div>
            `
          )}
        </div>
        <div class="info">
          <h1>${this.pallet}</h1>
          <div>
            <span>Storage:</span>
            <span class="mono">${this.storage.length}</span>
          </div>
          <div>
            <span>Extrinsics:</span>
            <span class="mono">${this.extrinsics.length}</span>
          </div>
          <div>
            <span>Const:</span>
            <span class="mono">${this.const.length}</span>
          </div>
        </div>
      </div>
    `;
  }
}
