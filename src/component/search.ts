import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {classMap} from 'lit/directives/class-map.js';

import type {AssetDoc} from '../polka/assets';

import {baseStyles} from '../base.css';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

@customElement('ui-search')
export class Search extends LitElement {
  @property({attribute: false})
  assets = [];

  @property({type: String})
  value = '';

  static styles = [
    baseStyles,
    css`
      .search {
        display: flex;
        flex-direction: column;
        width: 600px;
        position: relative;
        border: 2px solid var(--color-alternative);
        border-radius: 8px;
      }

      /* .search:hover {
        border: 2px solid var(--color-secondary);
      }

      .search:focus {
        border: 2px solid var(--color-secondary);
      } */

      .bar {
        padding: 5px 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-grow: 1;
      }

      .search input {
        padding: 5px 10px 5px;
        box-sizing: content-box;
        height: 1.4em;
        margin: 0px;
        display: block;
        min-width: 0px;
        width: 100%;
      }

      input {
        border-bottom: none !important;
        box-shadow: none !important;
      }

      .result {
        position: absolute;
        width: 100%;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-left: 2px solid var(--color-alternative);
        border-right: 2px solid var(--color-alternative);
        border-bottom: 2px solid var(--color-alternative);
        background-color: #fff;
        z-index: 2;
        margin-top: 44px;
        margin-left: -2px;
        max-height: 400px;
        overflow: scroll;
      }

      .result-items > a {
        padding: 5px 8px;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        align-items: center;
      }

      .result-items > a:hover {
        background-color: var(--color-action__hover);
      }

      .type {
        margin-left: 8px;
        padding: 0 5px;
        border: 1px solid var(--color-secondary);
        border-radius: 8px;
        font-size: 10px;
      }

      .highlighted {
        font-weight: 600;
      }

      .section {
        opacity: 0.7;
      }
    `,
  ];

  handleClick() {
    this.shadowRoot.getElementById('search').focus;
  }

  onChange(e: any) {
    this.value = e.target.value;
  }

  filterAssets(assets: Array<AssetDoc>, query: string) {
    return assets.filter(
      (a) => a.name.includes(query) || a.doc.includes(query)
    );
  }

  render() {
    const search = {
      open: this.value && this.value.length > 2,
      search: true,
    };
    return html`
      <div id="search" class=${classMap(search)} @click=${this.handleClick}>
        <div class="bar">
          <img height="24" width="24" src="assets/img/icon/search.svg" />
          <input
            name="name"
            type="text"
            .value="${this.value}"
            @input=${this.onChange}
            placeholder="Search the assets"
            class="form-field__input"
          />
        </div>
        ${when(
          this.value && this.value.length > 2,
          () => html`
            <div class="result">
              <div class="result-items">
                ${this.filterAssets(this.assets, this.value).map(
                  (item: AssetDoc) => {
                    const matches = match(item.name, this.value);
                    const parts = parse(item.name, matches);
                    return html`
                      <a
                        href="pallets/${item.section}/${item.type}/${item.name}"
                      >
                        ${parts.map((part) => {
                          const partClass = {
                            highlighted: part.highlight,
                          };
                          return html`
                            <span class=${classMap(partClass)}>
                              ${part.text}
                            </span>
                          `;
                        })}
                        <span class="type"> ${item.type} </span>
                        <span class="grow"> </span>
                        <span class="section"> ${item.section}</span>
                      </a>
                    `;
                  }
                )}
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}
