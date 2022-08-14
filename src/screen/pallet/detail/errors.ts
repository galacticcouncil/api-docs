import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {apiCursor} from '../../../db';
import {lookupErrorMetadata} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/markdown';

@customElement('app-error')
export class ErrorDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupErrorMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );
    }
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <span class="section">Error</span>
          <h1>${this.item.name}</h1>
          <div class="doc">
            <ui-markdown .docs=${this.itemMetadata.docs}></ui-markdown>
          </div>
          <div class="signature">
            <pre>${this.item.name}</pre>
            <span>Signature</span>
          </div>
        </div>
      `
    )}`;
  }
}
