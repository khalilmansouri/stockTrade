import mongoose, { Schema, Document } from "mongoose";

export interface ITrade extends Document {
  // trade unque ID
  id: number

  // trade type
  type: string

  // users info
  user: {
    id: number
    name: string
  }

  // stock symbol
  symbol: string

  // total share
  shares: number

  // price
  price: number

  timestamp: Date
}

const TradeSchema: Schema = new Schema(
	{
		// trade unque ID
		id: { type: Number, required: true },

		// trade type
		type: { type: String, enum: ["sell", "buy"], required: true },

		// users info
		user: {
			id: { type: Number, required: true },
			name: { type: String, required: true },
		},

		// stock symbol
		symbol: { type: String, required: true },

		// total share
		shares: { type: Number, required: true },

		// price
		price: { type: Number, required: true },

		timestamp: { type: Date, required: true },
	},
	{ versionKey: false }
);

TradeSchema.index({ id: 1 }, { unique: true });
TradeSchema.index({ symbol: 1 });
TradeSchema.index({ price: 1 });
TradeSchema.index({ timestamp: 1 });

export default mongoose.model<ITrade>("trades", TradeSchema);
