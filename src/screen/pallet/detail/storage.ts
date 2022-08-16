import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {classMap} from 'lit/directives/class-map.js';

import {apiCursor} from '../../../db';
import {
  lookupStorageMetadata,
  lookupStorageOutputLegacy,
  lookupStorageInputLegacy,
  lookupStorageTypeOrigin,
} from '../../../polka/lookup';

import {createTypeTree} from '../../../polka/utils';

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/markdown';

@customElement('app-storage')
export class StorageDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  @state()
  output = {lookup: [], lookupTree: null};

  @property({attribute: false})
  outputTemplate = [];

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupStorageMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );

      const lookup = lookupStorageTypeOrigin(
        apiCursor.deref().metadata,
        this.itemMetadata
      );
      const lookupTree = createTypeTree(lookup);

      console.log(lookup);

      this.output = {
        lookup: lookup,
        lookupTree: lookupTree,
      };
      this.lookupTemplate(this.output.lookupTree, 0);
    }
  }

  getInput(): String {
    return lookupStorageInputLegacy(
      apiCursor.deref().metadata,
      this.itemMetadata
    );
  }

  getOutput(): String {
    return lookupStorageOutputLegacy(
      apiCursor.deref().metadata,
      this.itemMetadata
    );
  }

  lookupHtml(level: number, info: String, emp: boolean) {
    const itemClasses = {
      'model-item': true,
      emphasize: emp,
    };
    return html`<div
      class=${classMap(itemClasses)}
      style="margin-left:${16 * level}px"
    >
      ${info}
    </div>`;
  }

  lookupTemplate(item: any, level: number) {
    if (item.typeId !== '1') {
      if (item.name && item.type) {
        this.outputTemplate.push(
          this.lookupHtml(level, `${item.type} (${item.name})`, false)
        );
      } else if (item.name) {
        this.outputTemplate.push(this.lookupHtml(level, `${item.name}`, false));
      } else if (item.type) {
        this.outputTemplate.push(this.lookupHtml(level, `${item.type}`, false));
      }
    }

    if (item.sub.length > 0) {
      level++;
      item.sub.map((i: any) => this.lookupTemplate(i, level));
    } else {
      return;
    }
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <span class="section">Storage</span>
          <h1>${this.item.name}</h1>
          <div class="doc">
            <ui-markdown .docs=${this.itemMetadata.docs}></ui-markdown>
          </div>
          <div class="signature">
            <pre>
${this.item.name}(${this.getInput()}): ${this.getOutput()}</pre
            >
            ${when(
              this.output.lookup.length > 1,
              () =>
                html` <div class="model">
                  <div>Model</div>
                  ${this.outputTemplate.map((i) => i)}
                </div>`
            )}
            <span>Signature</span>
          </div>
        </div>
      `
    )}`;
  }
}
