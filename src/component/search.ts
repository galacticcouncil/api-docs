import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {classMap} from 'lit/directives/class-map.js';

import type {AssetDoc} from '../polka/assets';

import {baseStyles} from '../base.css';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

@customElement('ui-search')
export class Search extends LitElement {
  @state()
  private clickAwayListener = null;

  @property({attribute: false})
  assets = [];

  @property({type: String})
  query = '';

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

  async firstUpdated() {
    var element = this.shadowRoot.getElementById('search');
    this.clickAwayListener = document.addEventListener('click', (event) => {
      const isClickInside = element.contains(event.target as Element);
      if (!isClickInside) {
        this.query = '';
      }
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this.clickAwayListener);
  }

  onInputChange(e: any) {
    this.query = e.target.value;
  }

  filterAssets(assets: Array<AssetDoc>, query: string) {
    return assets.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.doc.toLowerCase().includes(query.toLowerCase()) ||
        a.section.toLowerCase().includes(query.toLowerCase())
    );
  }

  render() {
    const search = {
      open: this.query && this.query.length > 2,
      search: true,
    };
    return html`
      <div id="search" class=${classMap(search)}>
        <div class="bar">
          <img height="24" width="24" src="assets/img/icon/search.svg" />
          <input
            name="name"
            type="text"
            .value="${this.query}"
            @input=${this.onInputChange}
            placeholder="Search the assets"
            class="form-field__input"
          />
        </div>
        ${when(
          this.query && this.query.length > 2,
          () => html`
            <div class="result">
              <div class="result-items">
                ${this.filterAssets(this.assets, this.query).map(
                  (item: AssetDoc) => {
                    const nameMatches = match(item.name, this.query);
                    const nameParts = parse(item.name, nameMatches);
                    return html`
                      <a
                        href="pallets/${item.section}/${item.type}/${item.name}"
                      >
                        ${nameParts.map(
                          (part: {highlight: boolean; text: string}) => {
                            const partClass = {
                              highlighted: part.highlight,
                            };
                            return html`
                              <span class=${classMap(partClass)}>
                                ${part.text}
                              </span>
                            `;
                          }
                        )}
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
