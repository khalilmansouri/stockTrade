import mongoose, { Schema, Document } from "mongoose";

export interface IFluctuation extends Document {
  // stock symbol
  symbol: string

  deference: number

  fluctuation: number

  timestamp: Date
}

const FluctuationSchema: Schema = new Schema(
	{
		// stock symbol
		symbol: { type: String, required: true },

		// price deference
		deference: { type: Number, required: true },

		fluctuation: { type: Number, required: true },

		timestamp: { type: Date, required: true }
	},
	{ versionKey: false }
);

FluctuationSchema.index({ symbol: 1 });
FluctuationSchema.index({ price: 1 });

export default mongoose.model<IFluctuation>("fluctuations", FluctuationSchema);
