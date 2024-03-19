import mongoose, { Schema } from "mongoose";

const timeSchema = new Schema(
  {
  timerName: { type: String, required: true },
  startDateTime: { type: Date, required: true  },
  endDateTime: {type: Date},  
  activeDuration: {type: String},
  isExpire: {type: Boolean, default: false}
  },
  { timestamps: true }
);

const Timers =
  mongoose.models.Timers || mongoose.model("Timers", timeSchema);

export default Timers;
