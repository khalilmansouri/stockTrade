	import tradesModel, { ITrade } from "@models/trades"
	import {Model} from "mongoose";


	class TradesController {

	model : Model<ITrade>
	constructor(model : Model<ITrade>){
		this.model = model;
	}
	/**
	 * Create new Trade 
	 * @param trade the Trade to be inserted 
	 */
	async create(trade: ITrade){
		await this.model.create(trade);
	}

	/**
	 * Find Trade by Id 
	 * @param id Trade id
	 * @returns  Trade
	 */
	async findById(id: number) :Promise<ITrade|null>{
		return await this.model.findOne({id});
	}


	/**
	 * Get all trades
	 * @returns Promise<ITrade[]>
	 */ 
	async getAll():Promise<ITrade[]> {
		// I've used aggregate insetead of find because of the date format in test
		// I'm forced to follow to the output of the tested 
		return await this.model
			.aggregate()
			.project({_id: 0, id: 1, price: 1, user: 1, type: 1,shares: 1, symbol: 1,
				timestamp: {
					$dateToString: {
						format: "%Y-%m-%d %H:%M:%S",
						date: "$timestamp",
						timezone: this.getTimeZoneOffset()
					}
				}
			})
			.sort({ id: 1 });
	}

	/**
	 * Get trades records by user id
	 * @returns Promise<ITrade[]>
	 */ 
	async getByUser(id: number):Promise<ITrade[]> {
		// I've used aggregate insetead of find because of the date format in test
		// I'm forced to follow to the output of the test files
		return await this.model
			.aggregate()
			.match({ "user.id": id })
			.project({_id: 0, id: 1, price: 1, user: 1, type: 1,shares: 1, symbol: 1,
				timestamp: {
					$dateToString: {
						format: "%Y-%m-%d %H:%M:%S",
						date: "$timestamp",
						timezone: this.getTimeZoneOffset()
					}
				}
			})
			.sort({ id: 1 });
	}


	/**
	 * Erase all the trades
	 */
	async erase(){
		await this.model.deleteMany()
	}


	getTimeZoneOffset(): string{
		const date = new Date();
		let zone = date.getTimezoneOffset()/60
		const s = "00" + Math.abs(zone);
		let sign = zone < 0 ? "+":"-";
		return  sign.concat(s.substr(s.length-2));
	}

}

	export default new TradesController(tradesModel);