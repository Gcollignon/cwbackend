const mongoose = require('mongoose');
const wrSchema = new mongoose.Schema({
  username : String,
  uuid : String,
  collection : String,
  collection_values : [{collection_time : Date, amount : Number}], //30Min array of collection values. 
  currentWR : {Type : Boolean, default : true}
})

const wrModel = new mongoose.Model('wr', wrSchema);
module.exports = wrModel;
