import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {db} from '../../../db';
import {
  lookupConstantsMetadata,
  lookupConstantTypeLegacy,
} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

@customElement('app-const')
export class ConstDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupConstantsMetadata(
        db.deref().metadata,
        this.item.section,
        this.item.name
      );
    }
  }

  getType(): String {
    return lookupConstantTypeLegacy(db.deref().metadata, this.itemMetadata);
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
          <pre>${this.item.name}: ${this.getType()}</pre>
        </div>
      `
    )}`;
  }
}
