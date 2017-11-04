# FXrates
## Description
A simple transactions currency converter built with **Express**, **MongoDB** and **React**.

## Usage
- Receives a JSON file upload in `([{ currency: 'EUR', amount: 192.23 }, ... { currency: 'CHF', amount: 1234.79 },])` format
- Stores the transactions to a database
- Can load all database transactions
- Has a currency switcher for `EUR, USD, JPY, CAD, CHF, GBP`
- Displays a table with 5 out of last 30 days with highest converted values in a selected currency

## Installation
- Run `npm run start-dev` for development build
- Run `npm run build` for local production build. Open on `localhost:5000`

## Live
App hosted on [Heroku](https://fxrates-5697.herokuapp.com/).

## Resources
Using [fixer.io](fixer.io) currency conversion data.
