import 'glamor/reset';
import {css} from 'glamor';

export default () => {
  css.global('*, *::before, *::after', {
    boxSizing: 'inherit'
  });

  css.global('html', {
    boxSizing: 'border-box'
  });

  css.global('body', {
    overflow: 'hidden'
  });

  css.global('h1, h2, h3, h4, h5, h6', {
    margin: 0
  });

  css.global('a', {
    color: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer'
  });

  css.global('a:hover', {
    textDecoration: 'none'
  });
};
