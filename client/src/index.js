import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style.css';

const currencies = ["EUR","USD","JPY","CAD","CHF","GBP"];
const proxyUrl = ((location.hostname === "localhost" || location.hostname === "127.0.0.1") ? "http://localhost:3001" : "");

ReactDOM.render(
  <App
    url={proxyUrl}
    pollinterval={2000}
    currencies={currencies} />,
  document.getElementById('root')
);
