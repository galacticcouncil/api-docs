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

  .signature {
    background-color: #f6f8fa;
    font-size: 15px;
    padding: 12px;
    border-radius: 4px;
    position: relative;
  }

  .signature > span {
    position: absolute;
    top: -8px;
    padding: 0 8px;
    border-radius: 2px;
    color: white;
    font-size: 13px;
    background-color: var(--color-secondary);
    font-weight: 550;
  }

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

  .emphasize {
    font-weight: 600;
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
`;
