import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {StorageDoc} from '../../../polka/meta/storage';

import {baseStyles} from '../../../base.css';
import {optionStyles} from '../options.css';

@customElement('app-storage-opts')
export class StorageOpts extends LitElement {
  @property({type: String})
  pallet = null;

  @property({attribute: false})
  loaded = false;

  @property({attribute: false})
  storage = [];

  static styles = [baseStyles, optionStyles];

  render() {
    return html`
      ${when(
        this.loaded && this.storage.length,
        () => html`
          <div class="category">Storage</div>
          <div class="items">
            ${this.storage.map((item: StorageDoc) => {
              return html`
                <a href="/pallets/${this.pallet}/storages/${item.name}">
                  ${item.name}(${item.input}): ${item.output}</a
                >
              `;
            })}
          </div>
        `
      )}
    `;
  }
}
