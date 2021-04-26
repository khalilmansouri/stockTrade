import tradesModel, { ITrade } from "@models/trades";
import {Model} from "mongoose";
import moment from "moment"

interface FluctuationsInfo {
	symbol: string,
	fluctuations: number,
	max_rise: number,
	max_fall: number
}
class StockController {
  
  model : Model<ITrade>
  constructor(model : Model<ITrade>){
		this.model = model;
  }


  /**
   * Return the highest and lowest price for the stock symbol in the given date range
	 * @param symbol String ; Stock symbol 
	 * @param startDate Date ; start Date 
	 * @param endDate Date ; end Date 
   * @returns Promise
   */ 

  async getMinMaxPrice({symbol, startDate, endDate}:{symbol :string, startDate: Date, endDate: Date}):Promise<any> {
		const max = await this.model
			.findOne({ symbol, timestamp: { $gte: startDate, $lte: endDate } })
			.sort({ price: 1 })
			.limit(1);
		const min = await this.model
			.findOne({ symbol, timestamp: { $gte: startDate, $lte: endDate } })
			.sort({ price: -1 })
			.limit(1);
		if (max && min) {
			return ({ lowest: min?.price, highest: max?.price, symbol });
		}
		else{
			return {}
		}
  }

  /**
   * Return fluctuations count, maximum daily rise and maximum daily fall for each stock symbol for the period in the given date range
   * @returns Promise<ITrade[]>
   */ 
  async getfluctuations({ start, end}:{ start: Date, end: Date}):Promise<any> {


		const groupedTransaction = await this.model.aggregate()
		// 1- Get all transaction at the given period 
		.match({ timestamp: { $gte: new Date(start), $lte: new Date(moment(end).add(1, "day").toString())}})
		// 2- sort them by symbol and timestamp: to be fast for later grouping
		.sort({ symbol: 1, timestamp: 1 })
		// 3- group the transactions that happen at the same time because they have the same price
		.group({
			_id: { symbol: "$symbol", date: "$timestamp" },
			symbol: { $first: "$symbol" },
			price: { $first: "$price" },
			timestamp: { $first: "$timestamp" }
		})
		.sort({ symbol: 1, timestamp: 1 })
		// 4- finally we get grouped transctions by stock symbol without repetion of transactions that happened at the same time
		.group({ _id: "$symbol", transactions: { $push: { price: "$price", timestamp: "$timestamp" } }
		})
		.sort({ _id: 1 });

		// Array to store Fluctuations Info of each stock
		const fluctuations: FluctuationsInfo[] = [];
		// Parse stock transactions in grouped transactions and extract number fluctuations, max rise and max fall
		groupedTransaction.forEach((el) => {
			const fuc : FluctuationsInfo= {
				symbol : el._id,
				fluctuations: 0,
				max_rise: 0.0,
				max_fall: 0.0,
			};
			fuc.symbol = el._id;

			if (el.transactions.length > 2) {
				let max_rise = 0;
				let max_fall = 0;
				// Parse all stock transactions to get max_rise max_fall, based on price defenrece
				for (let i = 1; i < el.transactions.length; i++) {
					const def = parseFloat(
						(el.transactions[i].price - el.transactions[i - 1].price).toFixed(2)
					);
					if (def > max_rise) max_rise = def;
					if (def < max_fall) max_fall = def;
				}
				fuc.max_rise = max_rise;
				fuc.max_fall = -max_fall;

				// Parse all stock transactions 3 per 3 and compare
				// if the middle transaction bigger or smaller then the surounding transaction, then that should be a fluctuation
				for (let i = 2; i < el.transactions.length; i++) {
					const first = el.transactions[i].price;
					const second = el.transactions[i - 1].price;
					const third = el.transactions[i - 2].price;

					if (
						(second > first && second > third) ||
						(second < first && second < third)
					) {
						fuc.fluctuations = fuc.fluctuations + 1;
					}
				}
			} else if (el.transactions.length == 2) { // If stock has less then 2 transactions means there's no chance of fluctuations, so stays 0 
				// Get max fall or max rise : shoud one or none of them in this case of transactions < 2 
				let def = el.transactions[1].price - el.transactions[0].price;
				def = parseFloat(def.toFixed(2));
				def > 0 ? (fuc.max_rise = def) : (fuc.max_fall = -def);
			}

			fluctuations.push(fuc);
		});
		// Get the orderd list of all the stock symbols 
		const totalStock = await this.model
			.aggregate()
			.sort({ symbol: 1 })
			.group({ _id: "$symbol", symbol: { $first: "$symbol" } });

		// fuse totalStock list, with fluctuations
		const finaleResult: any[] = [];
		totalStock.forEach((stock) => {
			const exist = fluctuations.find((fluc) => fluc.symbol === stock.symbol);
			if (exist)
				finaleResult.push(exist);
			else 
				finaleResult.push({symbol: stock.symbol, message: "There are no trades in the given date range"});  
		});

		return finaleResult
		}


}

export default new StockController(tradesModel);