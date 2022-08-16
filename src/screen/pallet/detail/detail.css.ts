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

  .model-item {
    position: relative;
  }

  .model-item:not(:first-of-type)::after {
    content: '';
    width: 10px;
    height: 2px;
    position: absolute;
    left: -14px;
    top: 11px;
    border-radius: 16px;
    background-color: var(--color-secondary);
  }

  .emphasize {
    font-weight: 600;
  }
`;
