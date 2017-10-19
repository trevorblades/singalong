import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Format from './pages/format';
import CarryOn from './songs/carry-on';
import Drop from './songs/drop';

const App = () => (
  <Router>
    <Switch>
      <Route exact component={Format} path="/" />
      <Route exact component={CarryOn} path="/carry-on" />
      <Route exact component={Drop} path="/drop" />
    </Switch>
  </Router>
);

export default App;
