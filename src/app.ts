import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {DatabaseController} from './db.ctrl';
import {listPallets} from './metadata/pallet';

import './component/navigation/navigation';

@customElement('app-root')
export class App extends LitElement {
  private database = new DatabaseController(this, this.localName);

  static styles = css`
    main {
      margin-left: var(--drawer-width);
    }
  `;

  render() {
    return html`
      ${when(
        this.database.state.ready,
        () => html`
          <header></header>
          <nav>
            <app-navigation
              .pallets=${listPallets(this.database.state.api)}
              .chain=${this.database.state.system.chain}
              .version=${this.database.state.system.version}
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
