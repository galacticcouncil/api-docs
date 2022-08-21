import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {apiCursor} from '../../../db';
import {lookupErrorMetadata} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/md-viewer';

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
          <h2>${this.item.name}</h2>
          <div class="doc">
            <ui-md-viewer .docs=${this.itemMetadata.docs}></ui-md-viewer>
          </div>
          <div class="subsection">
            <pre>${this.item.name}</pre>
            <span class="title">Signature</span>
          </div>
        </div>
      `
    )}`;
  }
}
