import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {apiCursor} from '../../../db';
import {lookupEventMetadata} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/md-viewer';

@customElement('app-event')
export class EventDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupEventMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );
    }
  }

  getTypes(): String {
    const fields = this.itemMetadata.fields.toHuman();
    if (fields.length === 0) {
      return '';
    }
    const isStruct = fields.find((f) => f.name);
    return isStruct
      ? '{\n' +
          fields.map((f) => `  ${f.name}: ${f.typeName}`).join(',\n') +
          '\n}'
      : '[ ' + fields.map((f) => f.typeName).join(', ') + ' ]';
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () =>
        html`
          <div class="detail">
            <span class="section">Event</span>
            <h2>${this.item.name}</h2>
            <div class="doc">
              <ui-md-viewer .docs=${this.itemMetadata.docs}></ui-md-viewer>
            </div>
            <div class="subsection">
              <pre>${this.item.name} ${this.getTypes()}</pre>
              <span class="title">Signature</span>
            </div>
          </div>
        `
    )}`;
  }
}
