import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import {apiCursor} from '../../../db';
import {lookupEventMetadata} from '../../../polka/lookup';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import showdown from 'showdown';

@customElement('app-event')
export class EventDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  @state()
  private converter = null;

  constructor() {
    super();
    this.converter = new showdown.Converter();
  }

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
    const isStruct = fields.find(f => f.name);
    return isStruct ?
        '{\n' + fields.map(f => `  ${f.name}: ${f.typeName}`).join(',\n') + '\n}' :
        '[ ' + fields.map(f => f.typeName).join(', ') + ' ]';
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () =>
        html`
          <div class="detail">
            <span class="section">Event</span>
            <h1>${this.item.name}</h1>
            <div class="doc">
              ${this.itemMetadata.docs.map((doc: string) => {
                const ht = this.converter.makeHtml(doc);
                return html` ${unsafeHTML(ht)}`;
              })}
            </div>
            <div class="signature">
              <pre>${this.item.name} ${this.getTypes()}</pre>
              <span>Signature</span>
            </div>
          </div>
        `
    )}`;
  }
}
