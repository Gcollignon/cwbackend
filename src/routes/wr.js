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
    await player.save();
    res.status(200);
    res.json({message : "done", player : player})

  }
  catch(e){
    res.status(500) //Throwing random error codes... Need to write proper error handling at some point.
    res.json({error : e.message})
    return
  }

})

router.get('/disable', async function(req, res){
  if (!req.query.username) {
    res.status(403)
    res.json({error : 'No username provided'})
    return
  }

  try {
    let player = await playerModel.findOne({username : req.query.username})
    player.wr_tracking = false;
    player.wr_tracking_info.collection = undefined
    player.wr_tracking_info.history = []
    await player.save();
    res.status(200);
    res.json({message: 'done', player : player})

  }
  catch(e){
    res.status(500)
    res.json({error: e.message})
    return
  }
})


router.get('/tracked', async function(req, res) {
  try {

    let players = await playerModel.find({wr_tracking : true})
    res.status(200);
    res.json(players)
  }
  catch(e){
    res.status(500)
    res.json({error : e.message})
    return
  }
})

router.get('/find', async function(req, res){
  try {


    if (req.query.current && req.query.current === true){
      let world_records =  await wrModel.find({currentWR : true})
      res.status(200);
      res.json(world_records);
    }
    else {
      let world_records = await wrModel.find();
      res.status(200);
      res.json(world_records);
    }
  }
  catch(e){
    res.status(500)
    res.json({error : e.message})
    return
  }
})

//Maybe splitting routes is good since we provide an array or an object depending on query.
router.get('/findone', async function(req, res){
  if (!req.query.collection){
    res.status(403)
    res.json({error : "No collection provided"})
    return;
  }
  try {


    if (req.query.history && req.query.history == true){
      //We need to provide all historical world records for this collection
      let world_records = await wrModel.find({collection : req.query.collection})
      res.status(200);
      res.json(world_records);
    }else {
      let world_record = await wrModel.findOne({collection : req.query.collection, currentWR : true})
      res.status(200);
      res.json(world_record);
    }
  }
  catch(e){
    res.status(500)
    res.json({error : e.message})
  }
})

router.get('/holders', async function(req, res){
  let world_records = await wrModel.find({currentWR : true})
  let holders = [] //For now I allow duplicate but can be changed if needed
  for (let wr of world_records){
    //TODO: Optimize this thing in case we keep the duplicate format. Can use find instead with a good query
    let player = await wrModel.findOne({username : wr.username})
    holders.push(player);
  }
  res.status(200);
  res.json(holders);

})

module.exports = router;

