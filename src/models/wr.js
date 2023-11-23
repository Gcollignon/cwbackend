const mongoose = require('mongoose');
//This schema holds wr. Not player data about wr mode.
const wrSchema = new mongoose.Schema({
  username : String,
  uuid : String,
  collection : String,
  collection_values : [{collection_time : Date, amount : Number}], //30Min array of collection values. 
  currentWR : {type : Boolean, default : true}
})

const wrModel = new mongoose.model('wr', wrSchema);
module.exports = wrModel;
