import express from "express";
import erase from "@routes/erase";
import trades from "@routes/trades";
import stocks from "@routes/stocks";
import errorHandler from "@middleware/errorHandler";
import mongodb from "./database/mongo"

const app = express();
const port = 8080;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);
app.use("/erase", erase);
app.use("/trades", trades);
app.use("/stocks", stocks);

let server;

(async () => {
	await mongodb.Init()
	server = app.listen(port, () => {
		console.log(`Listening on port ${port}.`);
		app.emit("ready");
	});
})();


export { app, server };
