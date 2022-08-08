import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {ExtrinsicDoc} from '../../../polka/meta/extrinsic';

import {baseStyles} from '../../../base.css';
import {optionStyles} from '../options.css';

@customElement('app-extrinsics-opts')
export class ExtrinsicsOpts extends LitElement {
  @property({type: String})
  pallet = null;

  @property({attribute: false})
  loaded = false;

  @property({attribute: false})
  extrinsics = [];

  static styles = [baseStyles, optionStyles];

  render() {
    return html`
      ${when(
        this.loaded && this.extrinsics.length,
        () => html`
          <div class="category">Extrinsics</div>
          <div class="items">
            ${this.extrinsics.map((item: ExtrinsicDoc) => {
              return html`
                <a href="/pallets/${this.pallet}/extrinsics/${item.name}">
                  ${item.name}(${item.input})
                </a>
              `;
            })}
          </div>
        `
      )}
    `;
  }
}
