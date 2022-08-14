import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {DatabaseController} from './db.ctrl';
import {apiCursor, Api} from './db';
import {listPallets} from './polka/pallet';

import './component/navigation';
import './component/header';
import './component/search';
import './component/busy-indicator';

@customElement('app-root')
export class App extends LitElement {
  private db = new DatabaseController<Api>(this, this.localName, apiCursor);

  @property({attribute: false})
  data = {pallets: [], chain: null, version: null, loaded: false};

  static styles = css`
    header {
      height: var(--toolbar-height);
      margin-left: var(--drawer-width);
    }

    main {
      margin-left: var(--drawer-width);
    }

    .loading {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `;

  async updated() {
    if (this.db.state && !this.data.loaded) {
      const metadata = this.db.state.metadata;
      const apiState = this.db.state.apiState;
      const pallets = listPallets(metadata);
      const version = apiState.specName + '/' + apiState.specVersion;

      this.data = {
        pallets: pallets,
        loaded: true,
        chain: apiState.systemName,
        version: version,
      };
    }
  }

  render() {
    return html`
      ${when(
        this.db.state,
        () => html`
          <header>
            <ui-header .assets=${this.db.state.assets}></ui-header>
          </header>
          <nav>
            <ui-navigation .data=${this.data}></ui-navigation>
          </nav>
          <main>
            <slot></slot>
          </main>
          <footer></footer>
        `,
        () => html`
          <div class="loading">
            <ui-busy-indicator size="large"></ui-busy-indicator>
          </div>
        `
      )}
    `;
  }
}
