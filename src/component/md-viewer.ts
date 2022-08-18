import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import showdown from 'showdown';

@customElement('ui-md-viewer')
export class MarkdownViewer extends LitElement {
  @property({attribute: false})
  docs = [];

  @state()
  private converter = null;

  static styles = css`
    li {
      display: list-item;
      text-align: -webkit-match-parent;
    }

    ul {
      display: block;
      list-style-type: disc;
      margin-block-start: 8px;
      margin-block-end: 8px;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 40px;
    }

    p {
      display: block;
      margin: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      display: block;
      font-size: 14px;
      margin-block-start: 0.67em;
      margin-block-end: 0.67em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      font-weight: bold;
    }
  `;

  constructor() {
    super();
    this.converter = new showdown.Converter();
  }

  render() {
    const doc = this.docs.join('\n');
    const ht = this.converter.makeHtml(doc);
    return html` ${unsafeHTML(ht)}`;
  }
}
