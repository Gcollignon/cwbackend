const mongoose = require('mongoose');
const PlayerSchema = new mongoose.Schema({
  username : String,
  rank : Number,
  malicious : {type : Boolean, default : false},
  malicious_reason : String,
  uuid : String, 
  coleweight : Number, 
  collections : [{
    name : String, 
    amount : Number,
    value : Number,
  }],
  kills : {
    name : String,
    amount : Number,
    value: Number
  },
  gemstone_powder : {amount : Number, value : Number},
  mithril_powder : {amount : Number, value : Number},
  mining_xp : {amount : Number, value : Number},
  nucleus_runs : {amount : Number, value : Number},
  history : [{
    historic_date : Date,
    coleweight : Number,
    mining_xp : Number,

  }],
  bad_behavior_history : [{
    report_date : Date,
    reason : String
  }],
  wr_tracking : {type :Boolean, default : false },
  wr_tracking_info : {collection : {type : String}, history : [{historic_date : Date, amount : Number}]},
  wrs : [String] //ObjectIds of wrs

})


module.exports = new mongoose.model('players', PlayerSchema);
