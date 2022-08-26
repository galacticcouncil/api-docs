import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {apiCursor} from '../../../db';
import {
  lookupConstantsMetadata,
  lookupConstantTypeLegacy,
} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/md-viewer';
import {decapitalize} from "../../../polka/utils";

@customElement('app-const')
export class ConstDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  @property({attribute: false})
  itemValue = null;

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      const {metadata, apiState} = apiCursor.deref();
      const {section, name} = this.item;
      this.itemMetadata = lookupConstantsMetadata(
        metadata,
        section,
        name
      );
      this.itemValue = apiState.api.consts[decapitalize(section)][decapitalize(name)];
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
          <h2>${this.item.name}</h2>
          <div class="doc">
            <ui-md-viewer .docs=${this.itemMetadata.docs}></ui-md-viewer>
          </div>
          <div class="subsection">
            <pre>${this.item.name}: ${this.getType()}</pre>
            <span class="title">Signature</span>
          </div>
          <div class="subsection">
            <pre class="data">${this.itemValue}</pre>
          </div>
        </div>
      `
    )}`;
  }
}
