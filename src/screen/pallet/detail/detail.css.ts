import {css} from 'lit';

export const detailStyles = css`
  .detail {
    padding: 40px 60px;
    max-width: 750px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: calc(100vh - var(--toolbar-height) - 81px);
  }

  .detail > div:not(:first-child) {
    margin-top: 24px;
  }

  .section {
    opacity: 0.5;
    font-weight: 600;
  }

  .subsection {
    background-color: #f6f8fa;
    font-size: 15px;
    padding: 12px;
    border-radius: 4px;
    position: relative;
  }

  .subsection > span.title {
    position: absolute;
    top: -8px;
    padding: 0 8px;
    border-radius: 2px;
    color: white;
    font-size: 13px;
    background-color: var(--color-secondary);
    font-weight: 550;
  }

  .subsection > span.close {
    cursor: pointer;
    position: absolute;
    top: -8px;
    right: 8px;
    padding: 0 8px;
    border-radius: 2px;
    color: #fff;
    font-size: 13px;
    background-color: var(--color-secondary);
    font-weight: 550;
  }

  .subsection > span.close:hover {
    color: #000;
  }

  .subsection > pre.data {
    font-size: 13px;
  }

  .actions {
    display: flex;
    flex-direction: row;
  }
`;
