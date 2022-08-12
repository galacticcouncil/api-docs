import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import {apiCursor} from '../../../db';
import {
  lookupConstantsMetadata,
  lookupConstantTypeLegacy,
} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import showdown from 'showdown';
//const converter = new showdown.Converter();

@customElement('app-const')
export class ConstDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  @state()
  private converter = null;

  constructor() {
    super();
    console.log("Fdfd");
    this.converter = new showdown.Converter();
  }

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupConstantsMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );
    }
  }

  getType(): String {
    return lookupConstantTypeLegacy(
      apiCursor.deref().metadata,
      this.itemMetadata
    );
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <span class="section">Constant</span>
          <h1>${this.item.name}</h1>
          <div class="doc">
            ${this.itemMetadata.docs.map((doc: string) => {
              const ht = this.converter.makeHtml(doc);
              return html` ${unsafeHTML(ht)}`;
            })}
          </div>
          <div class="signature">
            <pre>${this.item.name}: ${this.getType()}</pre>
            <span>Signature</span>
          </div>
        </div>
      `
    )}`;
  }
}
