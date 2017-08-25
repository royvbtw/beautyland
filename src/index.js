import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

function Root(props){
  return (
    <Router basename='/'>
      <App />
    </Router>
  );
}

ReactDOM.render( <Root />, document.getElementById('root'));
registerServiceWorker();
