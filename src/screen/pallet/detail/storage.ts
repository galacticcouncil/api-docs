import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {apiCursor} from '../../../db';
import {
  lookupStorageMetadata,
  lookupStorageOutputLegacy,
  lookupStorageInputLegacy,
  lookupStorageTypeOrigin,
} from '../../../polka/lookup';
import {decapitalize} from "../../../polka/utils";

import {baseStyles} from '../../../base.css';
import {detailStyles} from './detail.css';

import '../../../component/md-viewer';
import '../../../component/model-viewer';
import '../../../component/circular-progress';

@customElement('app-storage')
export class StorageDetail extends LitElement {
  @property({attribute: false})
  item = null;

  @property({attribute: false})
  itemMetadata = null;

  @state()
  lookup = [];

  @state()
  dump = null;

  @property({type: Boolean})
  progress = false;

  static styles = [baseStyles, detailStyles];

  async updated() {
    if (this.item && this.itemMetadata == null) {
      this.itemMetadata = lookupStorageMetadata(
        apiCursor.deref().metadata,
        this.item.section,
        this.item.name
      );

      this.lookup = lookupStorageTypeOrigin(
        apiCursor.deref().metadata,
        this.itemMetadata
      );
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

  async readStorage() {
    this.progress = true;
    const apiQuery = apiCursor.deref().apiState.api.query;
    const sectionName = decapitalize(this.item.section);
    const section = apiQuery[sectionName];
    const entryName = decapitalize(this.item.name);
    const storage = section[entryName]
    if (this.getInput()) {
      storage.entries()
        .then((entry) => {
          let test = [];
          entry.forEach(([key, exposure]) => {
            const keys = key.args.map((k) => {
              return k.toHuman();
            });
            const exp = exposure.toHuman();
            test.push([keys, exp]);
          });
          this.progress = false;
          this.dump = JSON.stringify(test, null, 2);
        })
        .catch((error) => {
          this.progress = false;
          console.error(error);
        });
    } else {
      const data = await storage();
      const humanized = data.toHuman();
      this.dump = typeof humanized === 'string' ? data.toString() : JSON.stringify(humanized, null, 2);
      console.log(this.dump);
      this.progress = false;
    }
  }

  clearStorage() {
    this.dump = null;
  }

  render() {
    return html` ${when(
      this.itemMetadata,
      () => html`
        <div class="detail">
          <span class="section">Storage</span>
          <h2>${this.item.name}</h2>
          <div class="doc">
            <ui-md-viewer .docs=${this.itemMetadata.docs}></ui-md-viewer>
          </div>
          <div class="subsection">
            <pre>
${this.item.name}(${this.getInput()}): ${this.getOutput()}</pre
            >
            <ui-model-viewer
              .name=${this.item.name}
              .lookup=${this.lookup}
            ></ui-model-viewer>
            <span class="title">Signature</span>
          </div>
          <div class="actions">
            ${when(
              !this.dump,
              () => html`
                <div class="btn">
                  <button @click=${this.readStorage} ?disabled=${this.progress}>
                    Read storage
                  </button>
                  <ui-circular-progress
                    ?progress=${this.progress}
                  ></ui-circular-progress>
                </div>
              `
            )}
          </div>
          ${when(
            this.dump,
            () => html`
              <div class="subsection">
                <pre class="data">${this.dump}</pre>
                <span @click=${this.clearStorage} class="close">x</span>
              </div>
            `
          )}
        </div>
      `
    )}`;
  }
}
