import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import {apiCursor} from '../../../db';
import {lookupErrorMetadata} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import showdown from 'showdown';
const converter = new showdown.Converter();

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
            ${this.itemMetadata.docs.map((doc: string) => {
              const ht = converter.makeHtml(doc);
              return html` ${unsafeHTML(ht)}`;
            })}
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
