import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {choose} from 'lit/directives/choose.js';
import {BeforeEnterObserver, RouterLocation} from '@vaadin/router';

import {DatabaseController} from '../../db.ctrl';
import {AssetDoc, AssetType} from '../../polka/assets';

import type {Doc} from '../../polka/types';

import {baseStyles} from '../../base.css';

import './options';
import './detail/storage';
import './detail/extrinsics';
import './detail/constants';
import './detail/errors';
import './detail/events';

@customElement('app-pallet')
export class Pallet extends LitElement implements BeforeEnterObserver {
  private db = new DatabaseController(this, this.localName);

  @state()
  params = null;

  @property({attribute: false})
  data = {
    storage: [],
    extrinsics: [],
    const: [],
    errors: [],
    events: [],
    loaded: false,
  };

  static styles = [
    baseStyles,
    css`
      .pallet {
        border-top: 1px solid var(--color-alternative);
        display: grid;
        grid-template-columns: 350px 1fr;
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
      const assets = this.db.state.assets;
      const storage = this.filterAssets(assets, AssetType.storage);
      const extrinsics = this.filterAssets(assets, AssetType.extrinsic);
      const constants = this.filterAssets(assets, AssetType.const);
      const errors = this.filterAssets(assets, AssetType.error);
      const events = this.filterAssets(assets, AssetType.event);

      this.data = {
        storage: storage,
        extrinsics: extrinsics,
        const: constants,
        errors: errors,
        events: events,
        loaded: true,
      };
    }
  }

  filterAssets(data: Array<AssetDoc>, type: AssetType) {
    return data
      .filter((i) => i.type === type && i.section === this.params.pallet)
      .sort(function (a: {name: string}, b: {name: string}) {
        return a.name.localeCompare(b.name);
      });
  }

  getSelected(data: Array<Doc>) {
    return data.filter((i) => i.name === this.params.item)[0];
  }

  render() {
    return html`
      <div class="pallet">
        <div class="menu">
          <app-opts
            .category=${'Storage'}
            .data=${this.data.storage}
            .params=${this.params}
          ></app-opts>
          <app-opts
            .category=${'Extrinsics'}
            .data=${this.data.extrinsics}
            .params=${this.params}
          ></app-opts>
          <app-opts
            .category=${'Constants'}
            .data=${this.data.const}
            .params=${this.params}
          ></app-opts>
          <app-opts
            .category=${'Errors'}
            .data=${this.data.errors}
            .params=${this.params}
          ></app-opts>
          <app-opts
            .category=${'Events'}
            .data=${this.data.events}
            .params=${this.params}
          ></app-opts>
        </div>
        ${choose(
          this.params.itemType,
          [
            [
              AssetType.storage,
              () => html`<app-storage
                .item=${this.getSelected(this.data.storage)}
              ></app-storage>`,
            ],
            [
              AssetType.extrinsic,
              () => html`<app-extrinsic
                .item=${this.getSelected(this.data.extrinsics)}
              ></app-extrinsic>`,
            ],
            [
              AssetType.const,
              () =>
                html`<app-const
                  .item=${this.getSelected(this.data.const)}
                ></app-const>`,
            ],
            [
              AssetType.error,
              () =>
                html`<app-error
                  .item=${this.getSelected(this.data.errors)}
                ></app-error>`,
            ],
            [
              AssetType.event,
              () =>
                html`<app-event
                  .item=${this.getSelected(this.data.events)}
                ></app-event>`,
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
            <div>
              <span>Errors:</span>
              <span class="mono">${this.data.errors.length}</span>
            </div>
            <div>
              <span>Events:</span>
              <span class="mono">${this.data.events.length}</span>
            </div>
          </div>`
        )}
      </div>
    `;
  }
}
