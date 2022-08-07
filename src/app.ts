import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {BeforeEnterObserver, RouterLocation} from '@vaadin/router';

import {DatabaseController} from './db.ctrl';
import {listPallets} from './polka/meta/pallet';

import './component/navigation';
import './component/header';

@customElement('app-root')
export class App extends LitElement implements BeforeEnterObserver {
  private db = new DatabaseController(this, this.localName);

  @property({type: String})
  section = null;

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
    this.section = location.params.id as string;
  }

  updateSection(e: CustomEvent) {
    this.section = e.detail.id;
  }

  render() {
    return html`
      ${when(
        this.db.state.ready,
        () => html`
          <header>
            <app-header .section=${this.section}></app-header>
          </header>
          <nav>
            <app-navigation
              .section=${this.section}
              .pallets=${listPallets(this.db.state.apiState.api)}
              .chain=${this.db.state.apiState.systemChain}
              .version=${this.db.state.apiState.systemVersion}
              @update-header=${this.updateSection}
            ></app-navigation>
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
