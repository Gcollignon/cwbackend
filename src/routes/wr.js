const express = require('express');
const playerModel = require('../models/player');
const wrModel = require('../models/wr');
const router = express.Router();


//Could merge into a single route instead ? Api consumption looks easier with 2 routes 
router.get('/enable', async function(req, res){
  if (! req.query.username){ //Ill write a middleware at somepoint i swear
    res.status(403)
    res.json({error : "No username provided"})
    return;
  }
  if (!req.query.collection){
    res.status(403)
    res.json({error : "No collection provided"})
    return;
  }

  try {
    let player = await playerModel.findOne({username : req.query.username})
    player.wr_tracking = true
    player.wr_tracking_info.collection = req.query.collection; //TODO: Make a lookup table to avoid using skyblock API names (they sucks);
    res.status(200);
    res.json({message : "done", player : player})



  }
  catch(e){
    res.status(500) //Throwing random error codes... Need to write proper error handling at some point.
    res.json({error : e.message})
    return
  }
  






})

module.exports = router;

