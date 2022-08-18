import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {apiCursor} from '../../../db';
import {
  lookupStorageMetadata,
  lookupStorageOutputLegacy,
  lookupStorageInputLegacy,
  lookupStorageTypeOrigin,
} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/md-viewer';
import '../../../component/model-viewer';

@customElement('app-storage')
export class StorageDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  @state()
  lookup = [];

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupStorageMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );

      this.lookup = lookupStorageTypeOrigin(
        apiCursor.deref().metadata,
        this.itemMetadata
      );
    }
  }

  getInput(): String {
    return lookupStorageInputLegacy(
      apiCursor.deref().metadata,
      this.itemMetadata
    );
  }

  getOutput(): String {
    return lookupStorageOutputLegacy(
      apiCursor.deref().metadata,
      this.itemMetadata
    );
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <span class="section">Storage</span>
          <h1>${this.item.name}</h1>
          <div class="doc">
            <ui-md-viewer .docs=${this.itemMetadata.docs}></ui-md-viewer>
          </div>
          <div class="signature">
            <pre>${this.item.name}(${this.getInput()}): ${this.getOutput()}</pre>
            <ui-model-viewer
              .name=${this.item.name}
              .lookup=${this.lookup}
            ></ui-model-viewer>
            <span>Signature</span>
          </div>
        </div>
      `
    )}`;
  }
}
