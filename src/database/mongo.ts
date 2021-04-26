import mongoose from "mongoose";
mongoose.Promise = require("bluebird");
import {EventEmitter} from "events";

// mongodb database credentials
const	DB_URI = process.env.DB_URI || "mongodb://localhost:27017/stock";
console.log(DB_URI)
// an event emitter class represent mongoose connection behavior
class MongoDB extends EventEmitter {
	constructor() {
		super();
    mongoose.connection.once("open", function () {
      console.log("MongoDB event open");
    
      mongoose.connection.on("connected", function () {
        console.log("MongoDB event connected");
      });
    
      mongoose.connection.on("disconnected", function () {
        console.log("MongoDB event disconnected");
      });
    
      mongoose.connection.on("reconnected", function () {
        console.log("MongoDB event reconnected");
      });
    
      mongoose.connection.on("error", function (err) {
        console.log("MongoDB event error: " + err);
      });
    });
	}

	async Init(){
		if (!DB_URI) throw new Error("Database uri is missing");
		await mongoose.connect(DB_URI,{ useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true });
	}
}

export default new MongoDB();


