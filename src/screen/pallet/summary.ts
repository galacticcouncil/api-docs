import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {choose} from 'lit/directives/choose.js';
import {BeforeEnterObserver, RouterLocation} from '@vaadin/router';

import {DatabaseController} from '../../db.ctrl';
import {listStorage} from '../../polka/meta/storage';
import {listExtrinsics} from '../../polka/meta/extrinsic';
import {listConst} from '../../polka/meta/const';
import type {Doc} from '../../polka/types';

import {baseStyles} from '../../base.css';

import './storage/options';
import './storage/detail';
import './extrinsics/options';
import './extrinsics/detail';
import './const/options';
import './const/detail';

@customElement('app-pallet')
export class Pallet extends LitElement implements BeforeEnterObserver {
  private db = new DatabaseController(this, this.localName);

  @state()
  params = null;

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

      .info {
        padding: 40px 60px;
        max-width: 750px;
        display: flex;
        flex-direction: column;
      }
    `,
  ];

  async onBeforeEnter(location: RouterLocation) {
    this.params = location.params;
  }

  async updated() {
    if (this.db.state.ready && !this.data.loaded) {
      const api = this.db.state.apiState.api;
      const storage = listStorage(api, this.params.pallet);
      const extrinsics = listExtrinsics(api, this.params.pallet);
      const cons = listConst(api, this.params.pallet);

      this.data = {
        storage: storage,
        extrinsics: extrinsics,
        const: cons,
        loaded: true,
      };
    }
  }

  getSelected(data: Array<Doc>) {
    return data.filter((i) => i.name === this.params.item)[0];
  }

  render() {
    return html`
      <div class="pallet">
        <div class="menu">
          <app-storage-opts
            .loaded=${this.data.loaded}
            .selected=${this.params.item}
            .storage=${this.data.storage}
            .pallet=${this.params.pallet}
          ></app-storage-opts>
          <app-extrinsics-opts
            .loaded=${this.data.loaded}
            .selected=${this.params.item}
            .extrinsics=${this.data.extrinsics}
            .pallet=${this.params.pallet}
          ></app-extrinsics-opts>
          <app-const-opts
            .loaded=${this.data.loaded}
            .selected=${this.params.item}
            .const=${this.data.const}
            .pallet=${this.params.pallet}
          ></app-const-opts>
        </div>
        ${choose(
          this.params.itemType,
          [
            [
              'storages',
              () => html`<app-storage
                .item=${this.getSelected(this.data.storage)}
              ></app-storage>`,
            ],
            [
              'extrinsics',
              () => html`<app-extrinsic
                .item=${this.getSelected(this.data.extrinsics)}
              ></app-extrinsic>`,
            ],
            [
              'consts',
              () =>
                html`<app-const
                  .item=${this.getSelected(this.data.const)}
                ></app-const>`,
            ],
          ],
          () => html`<div class="info">
            <h1>${this.params.pallet}</h1>
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
          </div>`
        )}
      </div>
    `;
  }
}
