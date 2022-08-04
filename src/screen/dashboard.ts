import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {DashboardController} from './dashboard.ctrl';

import {baseStyles} from '../base.css';
import {unwrapInfo} from '../wrappers';

@customElement('app-dashboard')
export class Dashboard extends LitElement {
  private dashboard = new DashboardController(this);

  static styles = [
    baseStyles,
    css`
      section .info {
        padding: 60px 0 45px;
      }

      .pallet {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px 20px 10px 10px;
        cursor: pointer;
        transition: all 0.2s;
        border-bottom: 1px solid rgba(59, 65, 81, 0.3);
      }

      .pallet-doc {
        display: none;
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .pallet-doc > div:not(:last-child) {
        margin-bottom: 10px;
      }

      .expanded .pallet-doc {
        display: block;
      }

      .pallet-item {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 4px;
      }

      .pallet-item__type {
        font-size: 10px;
        font-weight: 700;
        padding: 6px 15px;
        text-align: center;
        border-radius: 3px;
        background: #000;
        text-shadow: 0 1px 0 rgb(0 0 0 / 10%);
        font-family: sans-serif;
        text-transform: uppercase;
        color: #fff;
      }

      .pallet-item__name {
        align-items: center;
        word-break: break-word;
        padding: 0 10px;
        font-family: monospace;
        font-weight: 600;
        color: #3b4151;
      }

      .pallet-storage {
        border: 1px solid #49cc90;
        background: rgba(73, 204, 144, 0.1);
      }

      .pallet-storage .pallet-item__type {
        background: #49cc90;
      }

      .expand-collapse-icon {
        font-size: 16px;
        width: 1em;
        height: 1em;
        position: relative;
        display: inline-block;
        border-radius: 5px;
      }

      .expand-collapse-icon::before,
      .expand-collapse-icon::after {
        content: '';
        position: absolute;
        width: 1em;
        height: 0.16em;
        top: calc((1em / 2) - 0.08em);
        background-color: black;
        transition: 0.3s ease-in-out all;
        border-radius: 0.03em;
      }

      .expand-collapse-icon::after {
        transform: rotate(90deg);
      }

      .expanded span.expand-collapse-icon::after {
        transform: rotate(180deg);
      }

      .expanded span.expand-collapse-icon::before {
        transform: rotate(90deg) scale(0);
      }
    `,
  ];

  feedTemplate(metadata: any, index: number) {
    const typeDef = metadata.lookup.getTypeDef(index);
    const siType = metadata.lookup.getSiType(index);
    const name = metadata.lookup.getName(index) || typeDef.type;
    return html` <div>${index} : ${name}</div> `;
  }

  infoTemplate() {
    return html` <div class="info">
      <h2>Basilisk API</h2>
      <div>Chain: ${this.dashboard.data.chain}</div>
      <div>Name: ${this.dashboard.data.name}</div>
      <div>Version: ${this.dashboard.data.version}</div>
    </div>`;
  }

  palletItemTemplate(storage: any, type: string) {
    return html`
      <div class="pallet-item pallet-${type}">
        <span class="pallet-item__type">${type}</span>
        <span class="pallet-item__name">${storage.name}</span>
      </div>
    `;
  }

  palletExpand(id: string) {
    const pallet = this.shadowRoot.getElementById(id);
    if (pallet.classList.contains('expanded')) {
      pallet.classList.remove('expanded');
    } else {
      pallet.classList.add('expanded');
    }
  }

  palletTemplate(pallet: any) {
    console.log(pallet);
    return html`
      <div id="${pallet.name}">
        <div class="pallet" @click=${() => this.palletExpand(pallet.name)}>
          <h4>${pallet.name}</h4>
          <div class="grow"></div>
          <span class="expand-collapse-icon"> </span>
        </div>
        <div class="pallet-doc">
          ${when(
            pallet.storage,
            () =>
              pallet.storage.items.map((item) =>
                this.palletItemTemplate(item, 'storage')
              ),
            () => {}
          )}
        </div>
      </div>
    `;
  }

  lookupDump(metadata: any) {
    const lookupMap = new Map();
    metadata.lookup.types.forEach((type: any, index: number) => {
      const typeDef = metadata.lookup.getTypeDef(index);
      const siType = metadata.lookup.getSiType(index);
      const name = metadata.lookup.getName(index) || typeDef.type;
      lookupMap.set(index, {
        name: name,
        siType: siType.def.type,
        siTypeOri: siType,
        info: unwrapInfo(typeDef.info),
        type: typeDef.type,
        namespace: typeDef.namespace,
        fullType: type,
        typeDef: typeDef,
      });
    });
    return lookupMap;
  }

  palletsTemplate() {
    const metadata = this.dashboard.data.metadata;
    const lookupDump = this.lookupDump(metadata);
    console.log(lookupDump);
    const humanized = metadata.toHuman();
    return humanized.pallets
      .sort(function (a: {name: string}, b: {name: string}) {
        return a.name.localeCompare(b.name);
      })
      .map((pallet: any) => {
        return this.palletTemplate(pallet);
      });
  }

  render() {
    return html`
      ${when(
        this.dashboard.data.metadata,
        () => html` <section class="container">
          ${this.infoTemplate()} ${this.palletsTemplate()}
        </section>`,
        () => html`Loading metadata...`
      )}
    `;
  }
}
