import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {db} from '../../../db';
import {lookupExtrinsicMetadata} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

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
        db.deref().metadata,
        this.item.section,
        this.item.name
      );
    }
  }

  getInput(): String {
    const fields = this.itemMetadata.fields;
    return fields.map((f) => f.name).join(', ');
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <h1>${this.item.name}</h1>
          <div class="doc">
            ${this.itemMetadata.docs.map((doc: string) => {
              return html` <div>${doc}</div> `;
            })}
          </div>
          <pre>${this.item.name}(${this.getInput()})</pre>
        </div>
      `
    )}`;
  }
}
