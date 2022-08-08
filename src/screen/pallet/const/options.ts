import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {ConstDoc} from '../../../polka/meta/const';

import {baseStyles} from '../../../base.css';
import {optionStyles} from '../options.css';

@customElement('app-const-opts')
export class ConstOpts extends LitElement {
  @property({type: String})
  pallet = null;

  @property({attribute: false})
  loaded = false;

  @property({attribute: false})
  const = [];

  static styles = [baseStyles, optionStyles];

  render() {
    return html`
      ${when(
        this.loaded && this.const.length,
        () => html`
          <div class="category">Const</div>
          <div class="items">
            ${this.const.map((item: ConstDoc) => {
              return html`
                <a href="/pallets/${this.pallet}/consts/${item.name}">
                  ${item.name}: ${item.type}</a
                >
              `;
            })}
          </div>
        `
      )}
    `;
  }
}
