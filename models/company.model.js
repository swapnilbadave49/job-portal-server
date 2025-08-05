import mongoose, { mongo } from "mongoose";

const companySchema = new mongoose.Schema({
name:{
  type: String,
  requred: true,
  unique: true // Ensure company names are unique
},
description:{
  type: String
},
website:{
  type: String,
  requred: true
},
location:{
  type: String,
  requred: true
},

logo:{
  type: String,
  default: ""
},

userId:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}, //user who created company

},{ timestamps: true });


export const Company=mongoose.model("Company", companySchema);