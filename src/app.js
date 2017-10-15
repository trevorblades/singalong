import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Format from './pages/format';
import CarryOn from './songs/carry-on';

const App = () => (
  <Router>
    <Switch>
      <Route exact component={Format} path="/" />
      <Route exact component={CarryOn} path="/carry-on" />
    </Switch>
  </Router>
);

export default App;
