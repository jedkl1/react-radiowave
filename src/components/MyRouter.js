import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

function MyRouter() {
  return (
    <Router>
      <Route path="/" component={App} />
    </Router>
  );
}

export default MyRouter;
