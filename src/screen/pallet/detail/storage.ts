import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import {apiCursor} from '../../../db';
import {
  lookupStorageMetadata,
  lookupStorageOutputLegacy,
  lookupStorageInputLegacy,
} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import showdown from 'showdown';
const converter = new showdown.Converter();

@customElement('app-storage')
export class StorageDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupStorageMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );
    }
  }

  getInput(): String {
    return lookupStorageInputLegacy(apiCursor.deref().metadata, this.itemMetadata);
  }

  getOutput(): String {
    return lookupStorageOutputLegacy(apiCursor.deref().metadata, this.itemMetadata);
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <span class="section">Storage</span>
          <h1>${this.item.name}</h1>
          <div class="doc">
            ${this.itemMetadata.docs.map((doc: string) => {
              const ht = converter.makeHtml(doc);
              return html` ${unsafeHTML(ht)}`;
            })}
          </div>
          <div class="signature">
            <pre>${this.item.name}(${this.getInput()}): ${this.getOutput()}</pre>
            <span>Signature</span>
          </div>
        </div>
      `
    )}`;
  }
}
