import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {AfterEnterObserver, RouterLocation, ParamValue} from '@vaadin/router';

import {DatabaseController} from '../db.ctrl';
import {apiCursor, Api, readyCursor} from '../db';
import {getChains, changeApi} from '../effects';

import {baseStyles} from '../base.css';

import '../component/search';

@customElement('app-home')
export class Home extends LitElement implements AfterEnterObserver {
  private db = new DatabaseController<Api>(this, apiCursor);

  @state()
  private state = {options: [], chain: null};

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
        width: 500px;
        position: relative;
      }

      .version {
        position: absolute;
        top: 8px;
        margin-left: 160px;
        font-size: 10px;
        opacity: 0.8;
      }

      .links {
        margin-top: 24px;
      }

      .mono {
        font-family: monospace;
      }
    `,
  ];

  private onPageReload(chain: ParamValue) {
    getChains((opts) => {
      this.state = {
        options: opts,
        chain: chain,
      };
      if (chain) {
        changeApi(chain, opts);
      } else {
        window.location.href = 'Basilisk';
      }
    });
  }

  private onPageBack(chain: ParamValue) {
    getChains((opts) => {
      this.state = {
        options: opts,
        chain: chain,
      };
    });
  }

  async onAfterEnter(location: RouterLocation) {
    const chain = location.params.chain;
    if (this.db.state === null) {
      this.onPageReload(chain);
    } else {
      this.onPageBack(chain);
    }
  }

  private closeConnection() {
    apiCursor
      .deref()
      .apiState.api.disconnect()
      .then(() => {
        apiCursor.reset(null);
        readyCursor.reset(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return html` ${when(this.db.state, () => {
      const systemVersion = this.db.state.apiState.systemVersion.split(' ')[0];
      const systemChain = this.db.state.apiState.systemChain;
      const chainVersion =
        this.db.state.apiState.specName +
        '/' +
        this.db.state.apiState.specVersion;
      return html`
        <div class="dashboard">
          <ui-search
            .assets=${this.db.state.assets}
            .chain=${this.state.chain}
          ></ui-search>
          <div class="info">
            <h1>API Doc</h1>
            <span class="version">${systemVersion}</span>
            <div>
              <span>Chain:</span>
              <span class="mono">${systemChain}</span>
            </div>
            <div>
              <span>Version:</span>
              <span class="mono">${chainVersion}</span>
            </div>
            <div>
              <span>RPC:</span>
              <span class="mono">${this.db.state.node}</span>
            </div>
            <div class="links">
              ${this.state.options.map((item: {name: string; rpc: string}) => {
                return when(
                  this.db.state.node !== item.rpc,
                  () => html`<div class="goto">
                    <a
                      href="${item.name}"
                      @click=${() => this.closeConnection()}
                    >
                      <span class="goto-img"></span>
                      <span class="goto-txt">${item.name}</span>
                    </a>
                  </div>`
                );
              })}
            </div>
          </div>
        </div>
      `;
    })}`;
  }
}
