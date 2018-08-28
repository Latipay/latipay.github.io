import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Router, Route } from 'react-router';

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

/*
Router history={history}>
  <div>
    <Route exact path="/" component={} />
    <Route exact path="/miniapp" component={App} />
    <Route exact path="/invoice" component={App} />
    <Route exact path="/merchant-host" component={App} />
    <Route exact path="/barcode" component={App} />
    <Route exact path="/online" component={App} />
  </div>
</Router
*/
