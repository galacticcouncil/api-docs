import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {apiCursor} from '../../../db';
import {lookupExtrinsicMetadata} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/md-viewer';

@customElement('app-extrinsic')
export class ExtrinsicDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupExtrinsicMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );
    }
  }

  getInput(): String {
    const fields = this.itemMetadata.fields;
    return (
      '(\n' +
      fields.map((f) => `  ${f.name}: ${f.typeName}`).join(',\n') +
      '\n)'
    );
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <span class="section">Extrinsic</span>
          <h1>${this.item.name}</h1>
          <div class="doc">
            <ui-md-viewer .docs=${this.itemMetadata.docs}></ui-md-viewer>
          </div>
          <div class="signature">
            <pre>${this.item.name}${this.getInput()}</pre>
            <span>Signature</span>
          </div>
        </div>
      `
    )}`;
  }
}
