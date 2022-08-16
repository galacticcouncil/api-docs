import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {baseStyles} from '../base.css';

import {createTypeTree} from '../polka/utils';

@customElement('ui-model-viewer')
export class ModelViewer extends LitElement {
  @state()
  private model = [];

  @state()
  private template = [];

  @property({attribute: false})
  name = null;

  @property({attribute: false})
  lookup = null;

  static styles = [
    baseStyles,
    css`
      .model {
        margin-top: 16px;
      }

      .model-bar {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .model-tree {
        font-size: 14px;
        display: none;
      }

      .expanded .model-tree {
        display: block;
      }

      .model-item {
        position: relative;
      }

      .model-tree .model-item:not(:first-of-type)::after {
        content: '';
        width: 5px;
        height: 5px;
        position: absolute;
        left: -12px;
        top: 9px;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .expand-collapse-icon {
        font-size: 10px;
        width: 1em;
        height: 1em;
        position: relative;
        display: inline-block;
        border-radius: 5px;
        margin-left: 5px;
      }

      .expand-collapse-icon::before,
      .expand-collapse-icon::after {
        content: '';
        position: absolute;
        width: 1em;
        height: 0.16em;
        top: calc((1em / 2) - 0.08em);
        background-color: var(--color-secondary);
        transition: 0.3s ease-in-out all;
        border-radius: 0.03em;
      }

      .expand-collapse-icon::after {
        transform: rotate(90deg);
      }

      .expanded span.expand-collapse-icon::after {
        transform: rotate(180deg);
      }

      .expanded span.expand-collapse-icon::before {
        transform: rotate(90deg) scale(0);
      }
    `,
  ];

  async firstUpdated() {
    const lookupTree = createTypeTree(this.lookup);
    this.lookupTemplate(lookupTree, 0);
  }

  lookupHtml(level: number, info: String) {
    return html`<div class="model-item" style="margin-left:${16 * level}px">
      ${info}
    </div>`;
  }

  lookupTemplate(item: any, level: number) {
    if (item.typeId !== '1') {
      if (item.name && item.type) {
        this.model.push(this.lookupHtml(level, `${item.type} (${item.name})`));
      } else if (item.name) {
        this.model.push(this.lookupHtml(level, `${item.name}`));
      } else if (item.type) {
        this.model.push(this.lookupHtml(level, `${item.type}`));
      }
    }

    if (item.sub.length > 0) {
      level++;
      item.sub.map((i: any) => this.lookupTemplate(i, level));
    } else {
      this.template = this.model; // Make sure cmp is re-rendered once recursive template fill done
      return;
    }
  }

  modelExpand(id: string) {
    const model = this.shadowRoot.getElementById(id);
    if (model.classList.contains('expanded')) {
      model.classList.remove('expanded');
    } else {
      model.classList.add('expanded');
    }
  }

  render() {
    return html`
      ${when(
        this.lookup.length > 1,
        () =>
          html` <div
            class="model"
            id="${this.name}"
            @click=${() => this.modelExpand(this.name)}
          >
            <div class="model-bar">
              <h4>Model</h4>
              <span class="expand-collapse-icon"> </span>
            </div>
            <div class="model-tree">${this.template.map((i) => i)}</div>
          </div>`
      )}
    `;
  }
}
