import { Request, Response } from "express";
import express from "express";
import erase from "./routes/erase";
import trades from "./routes/trades";
import stocks from "./routes/stocks";
import mongoose from "mongoose";

const app = express();
const port = 8080;

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



app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));


function errorMiddleware(error: any, request: Request, response: Response, next) {
	const status = error.status || 500;
	const message = error.message || "Something went wrong";
	response
		.status(status)
		.send({
			status,
			message,
		});
}

app.use(errorMiddleware);

app.use("/erase", erase);
app.use("/trades", trades);
app.use("/stocks", stocks);

let server;

(async () => {
	await mongoose.connect("mongodb://localhost:27017/test-todo", {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		poolSize: 100
	});
	console.log("Connected to db.");
	server = app.listen(port, () => {
		console.log(`Listening on port ${port}.`);
		app.emit("ready");
	});
})();


export { app, server };
