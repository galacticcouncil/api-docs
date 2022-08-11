import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {DatabaseController} from '../db.ctrl';

import {baseStyles} from '../base.css';

import '../component/search';

@customElement('app-home')
export class Home extends LitElement {
  private db = new DatabaseController(this, this.localName);

  static styles = [
    baseStyles,
    css`
      .dashboard {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 150px;
      }

      .info {
        margin-top: 40px;
      }

      .links {
        margin-top: 24px;
      }

      .mono {
        font-family: monospace;
      }
    `,
  ];

  render() {
    return html` ${when(
      this.db.state.ready,
      () => html`
        <div class="dashboard">
          <ui-search .assets=${this.db.state.assets}></ui-search>
          <div class="info">
            <h1>API Doc</h1>
            <div>
              <span>Chain:</span>
              <span class="mono">${this.db.state.apiState.systemChain}</span>
            </div>
            <div>
              <span>Name:</span>
              <span class="mono">${this.db.state.apiState.systemName}</span>
            </div>
            <div>
              <span>Version:</span>
              <span class="mono">${this.db.state.apiState.systemVersion}</span>
            </div>
            <div class="links">
              <div class="goto">
                <a href="#pallets">
                  <span class="goto-img"></span>
                  <span class="goto-txt">Pallets</span>
                </a>
              </div>
              <div class="goto">
                <a href="#rpc">
                  <span class="goto-img"></span>
                  <span class="goto-txt">RPC Calls</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      `
    )}`;
  }
}
