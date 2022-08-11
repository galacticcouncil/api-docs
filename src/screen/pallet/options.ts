import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {classMap} from 'lit/directives/class-map.js';

import {AssetDoc} from '../../polka/assets';

import {baseStyles} from '../../base.css';

@customElement('app-opts')
export class ConstOpts extends LitElement {
  @property({type: String})
  params = null;

  @property({type: String})
  category = null;

  @property({attribute: false})
  data = [];

  static styles = [
    baseStyles,
    css`
      .category {
        padding: 4px 16px;
        font-weight: 600;
        line-height: 1.5;
        text-transform: uppercase;
        position: sticky;
        color: var(--color-main);
        background-color: #fff;
      }

      .category {
        top: 0;
      }

      .items {
        display: flex;
        flex-direction: column;
      }

      .items > a {
        padding: 4px 16px 4px 24px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .items > a.selected {
        background-color: var(--color-secondary);
        color: #fff;
        font-weight: 600;
      }

      .items > a.selected:hover {
        background-color: var(--color-secondary);
      }

      .items > a:hover {
        background-color: var(--color-action__hover);
      }
    `,
  ];

  render() {
    return html`
      ${when(
        this.data && this.data.length,
        () => html`
          <div class="category">${this.category}</div>
          <div class="items">
            ${this.data.map((item: AssetDoc) => {
              const itemClasses = {
                selected:
                  this.params.item === item.name &&
                  this.params.itemType === item.type,
              };
              return html`
                <a
                  class=${classMap(itemClasses)}
                  href="pallets/${this.params.pallet}/${item.type}/${item.name}"
                >
                  ${item.name}</a
                >
              `;
            })}
          </div>
        `
      )}
    `;
  }
}
