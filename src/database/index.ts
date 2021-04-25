import mongoose from "mongoose";
mongoose.Promise = require("bluebird");
import {EventEmitter} from "events";

/**
 * mongodb database credentials
 */


const	uri = process.env.MONSTER_MONGO_DB_URI || "mongodb://localhost:27017/stock";


/**
 * an event emitter class represent mongoose connection behavior
 */
class Connection extends EventEmitter {
	_connection: mongoose.Connection
	_db_uri : string
	constructor(uri: string) {
		super();
		this._db_uri = uri;
		mongoose.set("useFindAndModify", false);
		mongoose.set("useCreateIndex", true);
		mongoose.set("useNewUrlParser", true);
		mongoose.set("useUnifiedTopology", true);
		// mongoose.set("reconnectTries", Number.MIN_VALUE)
		// mongoose.set("autoReconnect", true)
		// reconnectTries : Number.MAX_VALUE,
		// autoReconnect : true
		this._connection = mongoose.createConnection();
		this._listen();
		this._connect();
	}

	get connection(): mongoose.Connection {
		return this._connection;
	}

	_listen() {
		this._connection.on("connected", () => {
			console.log("Connected to database");
		});
		this._connection.on("error", (error) => {
			console.log(`Connecting to database failed. ${error.message}`);
		});
		this._connection.on("disconnected", () => {
			console.log("Database disconnected");
		});
		this._connection.on("disconnecting", (error) => {
			if (error) console.log(error);
			else console.log("Database is disconnecting ...");
		});
	}

	_connect() {
		if (!this._db_uri) throw new Error("Database uri is missing");
		this._connection.openUri(this._db_uri);
	}
}

export default new Connection(uri).connection;
