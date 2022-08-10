import {css} from 'lit';

export const detailStyles = css`
  .detail {
    padding: 40px 60px;
    max-width: 750px;
    display: flex;
    flex-direction: column;
  }

  .detail > div:not(:first-child) {
    margin-top: 24px;
  }

  .doc li {
    display: list-item;
    text-align: -webkit-match-parent;
  }

  .doc ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  .doc p {
    display: block;
  }

  .signature {
    background-color: var(--color-alternative);
    font-size: 15px;
    padding: 8px;
    border-radius: 8px;
    position: relative;
  }

  .signature > span {
    position: absolute;
    top: -8px;
    padding: 0 5px;
    border-radius: 8px;
    font-size: 10px;
    background-color: var(--color-secondary);
    font-weight: 600;
  }
`;
