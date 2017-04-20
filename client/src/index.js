import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const currencies = ["EUR","USD","JPY","CAD","CHF","GBP"];

ReactDOM.render(
  <App
    url="http://localhost:3001"
    pollinterval={2000}
    currencies={currencies} />,
  document.getElementById('root')
);
