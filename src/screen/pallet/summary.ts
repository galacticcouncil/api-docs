import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {BeforeEnterObserver, RouterLocation} from '@vaadin/router';

import {DatabaseController} from '../../db.ctrl';
import {listStorage} from '../../polka/meta/storage';
import {listExtrinsics} from '../../polka/meta/extrinsic';
import {listConst} from '../../polka/meta/const';

import {baseStyles} from '../../base.css';

import './storage/options';
import './extrinsics/options';
import './const/options';

@customElement('app-pallet')
export class Pallet extends LitElement implements BeforeEnterObserver {
  private db = new DatabaseController(this, this.localName);

  @property({type: String})
  pallet = null;

  @property({attribute: false})
  data = {storage: [], extrinsics: [], const: [], loaded: false};

  static styles = [
    baseStyles,
    css`
      .pallet {
        border-top: 1px solid var(--color-alternative);
        display: grid;
        grid-template-columns: 600px 1fr;
        grid-template-areas: 'menu .';
      }

      .menu {
        grid-area: menu;
        border-right: 1px solid var(--color-alternative);
        height: calc(100vh - var(--toolbar-height) - 1px);
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
        background-color: #fff;
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

      .menu .items > a:hover {
        background-color: var(--color-action-hover);
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
    if (this.db.state.ready && !this.data.loaded) {
      const api = this.db.state.apiState.api;
      const storage = listStorage(api, this.pallet);
      const extrinsics = listExtrinsics(api, this.pallet);
      const cons = listConst(api, this.pallet);

      this.data = {
        storage: storage,
        extrinsics: extrinsics,
        const: cons,
        loaded: true,
      };
    }
  }

  render() {
    return html`
      <div class="pallet">
        <div class="menu">
          <app-storage-opts
            .loaded=${this.data.loaded}
            .storage=${this.data.storage}
            .pallet=${this.pallet}
          ></app-storage-opts>
          <app-extrinsics-opts
            .loaded=${this.data.loaded}
            .extrinsics=${this.data.extrinsics}
            .pallet=${this.pallet}
          ></app-extrinsics-opts>
          <app-const-opts
            .loaded=${this.data.loaded}
            .const=${this.data.const}
            .pallet=${this.pallet}
          ></app-const-opts>
        </div>
        <div class="info">
          <h1>${this.pallet}</h1>
          <div>
            <span>Storage:</span>
            <span class="mono">${this.data.storage.length}</span>
          </div>
          <div>
            <span>Extrinsics:</span>
            <span class="mono">${this.data.extrinsics.length}</span>
          </div>
          <div>
            <span>Const:</span>
            <span class="mono">${this.data.const.length}</span>
          </div>
        </div>
      </div>
    `;
  }
}
