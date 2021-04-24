import mongoose from 'mongoose';
mongoose.Promise = require("bluebird");
const EventEmitter = require("events");

/**
 * mongodb database credentials
 */

let options = {
  uri: process.env.MONSTER_MONGO_DB_URI || "mongodb://localhost:27017/stock",
};

/**
 * an event emitter class represent mongoose connection behavior
 */
class Connection extends EventEmitter {
  _connection: mongoose.Connection

  constructor(options) {
    super();
    this._options = options;
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);
    this._connection = mongoose.createConnection();
    this._listen();
    this._connect();
  }

  get connection(): mongoose.Connection {
    return this._connection;
  }

  _listen() {
    this._connection.on("connected", () => {
      console.log(`Connected to database`);
    });
    this._connection.on("error", error => {
      console.log(`Connect to ${this._options.name} database failed. ${error.message}`);
    });
    this._connection.on("disconnected", () => {
      console.log(`Connect to ${this._options.name} database disconnected`);
    });
    this._connection.on("disconnecting", error => {
      console.log(`Connect to ${this._options.name} database is disconnecting. ${error.message}`);
    });
  }

  _connect() {
    const { uri } = this._options;
    if (!uri) throw new Error("Database uri is missing");
    this._connection.openUri(uri);
  }
}

export default new Connection(options).connection;
