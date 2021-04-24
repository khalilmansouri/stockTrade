// import Boom from '@hapi/boom';
import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
import express from 'express';
// import expressPinoLogger from 'express-pino-logger';
import path from 'path';
import pino from 'pino';
// import { indexRouter } from './routes';
import erase from "./routes/erase"
import trades from "./routes/trades"
import stocks from "./routes/stocks"
import mongoose from "mongoose"

const logger = pino({});
const app = express();
const port = 8080;

// require("./database")

mongoose.connection.once('open', function () {
    console.log('MongoDB event open');;

    mongoose.connection.on('connected', function () {
        console.log('MongoDB event connected');
    });

    mongoose.connection.on('disconnected', function () {
        console.log('MongoDB event disconnected');
    });

    mongoose.connection.on('reconnected', function () {
        console.log('MongoDB event reconnected');
    });

    mongoose.connection.on('error', function (err) {
        console.log('MongoDB event error: ' + err);
    });
});





app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));


// error handler
app.use((err, req, res, next) => {
    console.log(err)
    res.sendStatus(err.status || 502)
});

app.use('/erase', erase);
app.use('/trades', trades);
app.use('/stocks', stocks);

let server

(async () => {
    await mongoose.connect('mongodb://localhost:27017/test-todo', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        poolSize: 100
    })
    console.log("Connected to db.");
    server = app.listen(port, () => {
        console.log(`Listening on port ${port}.`)
        app.emit("ready");
    });
})();

// const server = app.listen(port, () => logger.info(`Example app listening at http://localhost:${port}`))
export { app, server }
