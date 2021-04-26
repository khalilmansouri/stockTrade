# Stock trade APIs

[![Test Status](https://github.com/khalilmansouri/stocktrade/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/khalilmansouri/stockTrade/actions)

The API uses the provided template along with mongodb as database,

All endpoint are implemented and passed the test

in some endpoint, Due the `timestamp` date format in test data file, I've been forced to use aggregate() to update date format to match the provided format in test data files, otherwise the tests won't pass

## Tesing

1- Lunch mongoDB from docker-compose file inside test folder

`cd test && docker-compose up`

Run test suites

`npm run test`

## missing steps

- Data validation : Injected data in endpoint is not validated yet
