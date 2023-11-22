const express = require('express');
const router = express.Router();
const playerModel = require('../models/player');

//Need to add an auth to theses routes. Will think about it later.
router.get('/add', async function(req, res){
  if (!req.query.username) {
    res.status(403);
    res.json({error : "No username provided."})
    return
  }

  if (!req.query.reason) {
    res.status(403)
    res.json({error : "No reason provided"})
    return
  }
  try {
  let player = await playerModel.findOne({username : req.query.username});
  player.malicious = true;
  player.malicious_reason = req.query.reason;
  player.bad_behavior_history.push({report_date : Date.now(), reason : req.query.reason})
  await player.save();

  res.status(200);
  res.json({message : "done", player : player})
  }catch(e){
    res.status(404);
    res.json({error : "player not found"})
  }


})


router.get('/findall', async function(req, res){
  let players = await playerModel.find({malicious : true})
  res.status(200);
  res.json(players);
})


//This route seems pretty useless but maybe it's used somewhere so i wrote it...
router.get('/find', async function(req, res){
  if(!req.query.username){
    res.status(403);
    res.json({error : "No username provided."})
    return;
  }
  try {

  
  let player = await playerModel.findOne({username : req.query.username})
  if (player.malicious == false){
    res.status(404);
    res.json({error : 'player is not malicious'})
    return
  }

  res.status(200);
  res.json(player);
  }catch(e){
    res.status(404);
    res.json({error : 'player not found'})
  }
})


router.get('/remove', async function(req, res){
  if (!req.query.username){
    res.status(403);
    res.json({error : "No username provided."})
    return;
  }
  try {
  let player = await playerModel.findOne({username : req.query.username})
  player.malicious = false;
  player.malicious_reason = "";
  await player.save();
  res.status(200);
  res.json({message : "done", player : player})
  }
  catch(e){
    res.json({error : 'player not found'})
  }
})


router.get('/clear', async function(req, res){
  //Should write a middleware or switch to rust and make a macro because of this fucking check x) 
  if (!req.query.username){
    res.status(403);
    res.json({error : "No username provided."})
    return;
  }
  try {

  
  let player = await playerModel.findOne({username : req.query.username})
  player.malicious = false;
  player.malicious_reason = undefined,
  player.bad_behavior_history = []
  await player.save();
  res.json({message : 'done', player : player})
  }
  catch(e){
    res.json({error : 'player not found'})
  }


})

module.exports = router;
