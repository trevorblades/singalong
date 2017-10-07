import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App from './components/app';
import styles from './styles';

const render = Component => {
  styles();
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);
if (module.hot) {
  module.hot.accept('./components/app', () => {
    render(App);
  });
}
