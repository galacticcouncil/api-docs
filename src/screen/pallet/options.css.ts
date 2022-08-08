import {css} from 'lit';

export const optionStyles = css`
  .category {
    padding: 4px 16px;
    font-weight: 600;
    line-height: 1.5;
    text-transform: uppercase;
    position: sticky;
    color: var(--color-main);
    background-color: #fff;
  }

  .category {
    top: 0;
  }

  .items {
    display: flex;
    flex-direction: column;
  }

  .items > a {
    padding: 4px 16px 4px 24px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .items > a.selected {
    background-color: var(--color-secondary);
    color: #fff;
    font-weight: 600;
  }

  .items > a.selected:hover {
    background-color: var(--color-secondary);
  }

  .items > a:hover {
    background-color: var(--color-action-hover);
  }
`;
