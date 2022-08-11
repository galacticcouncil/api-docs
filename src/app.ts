import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {BeforeEnterObserver, RouterLocation} from '@vaadin/router';

import {DatabaseController} from './db.ctrl';
import {listPallets} from './polka/pallet';

import './component/navigation';
import './component/header';

@customElement('app-root')
export class App extends LitElement implements BeforeEnterObserver {
  private db = new DatabaseController(this, this.localName);

  @property({attribute: false})
  params = null;

  @property({attribute: false})
  data = {pallets: [], loaded: false};

  static styles = css`
    header {
      height: var(--toolbar-height);
      margin-left: var(--drawer-width);
    }

    main {
      margin-left: var(--drawer-width);
    }
  `;

  async onBeforeEnter(location: RouterLocation) {
    this.params = location.params;
  }

  async updated() {
    if (this.db.state.ready && !this.data.loaded) {
      const metadata = this.db.state.metadata;
      const pallets = listPallets(metadata);

      this.data = {
        pallets: pallets,
        loaded: true,
      };
    }
  }

  updateSection(e: CustomEvent) {
    this.params = e.detail;
  }

  render() {
    return html`
      ${when(
        this.db.state.ready,
        () => html`
          <header>
            <ui-header
              .params=${this.params}
              @update-header=${this.updateSection}
            ></ui-header>
          </header>
          <nav>
            <ui-navigation
              .params=${this.params}
              .pallets=${this.data.pallets}
              .chain=${this.db.state.apiState.systemChain}
              .version=${this.db.state.apiState.systemVersion}
              @update-header=${this.updateSection}
            ></ui-navigation>
          </nav>
          <main>
            <slot></slot>
          </main>
          <footer></footer>
        `,
        () => html`Loading metadata...`
      )}
    `;
  }
}
