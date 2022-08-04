import {css} from 'lit';

export const baseStyles = css`
  /* Reset */
  a,
  abbr,
  acronym,
  address,
  applet,
  article,
  aside,
  audio,
  b,
  big,
  blockquote,
  body,
  canvas,
  caption,
  center,
  cite,
  code,
  dd,
  del,
  details,
  dfn,
  div,
  dl,
  dt,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  header,
  hgroup,
  html,
  i,
  iframe,
  img,
  ins,
  kbd,
  label,
  legend,
  li,
  mark,
  menu,
  nav,
  object,
  ol,
  output,
  p,
  pre,
  q,
  ruby,
  s,
  samp,
  section,
  small,
  span,
  strike,
  strong,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  tfoot,
  th,
  thead,
  time,
  tr,
  tt,
  u,
  ul,
  var,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a,
  button,
  button:focus,
  input,
  input:focus,
  select,
  select:focus,
  textarea,
  textarea:focus {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    border: none;
  }

  button,
  input,
  select,
  textarea {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .hidden {
    display: none;
  }

  .grow {
    flex: 1;
  }

  /* Container */

  .container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 576px) {
    .container {
      max-width: 540px;
    }
  }

  @media (min-width: 768px) {
    .container {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    .container {
      max-width: 960px;
    }
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1140px;
    }
  }

  @media (min-width: 1366px) {
    .container {
      max-width: 1290px;
    }
  }

  /* Section */

  section {
    padding-top: 75px;
  }

  @media (min-width: 768px) {
    section > div {
      margin-left: 8.33333%;
      flex: 0 0 83.33333%;
      max-width: 83.33333%;
    }
  }

  section h2 {
    font-weight: 700;
    font-size: 30px;
  }

  section h3 {
    font-size: 20px;
    margin-bottom: 40px;
  }
`;
