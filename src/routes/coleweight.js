const express = require('express');
const router = express.Router();
const playerHandling = require('../functions/playerHandling')
const playerModel = require('../models/player')
router.get('/', async function(req, res){
  res.json({message: "api working"})
})

router.get('/find', async function(req, res){
  if(!req.query.username){
    res.status(403);
    res.json({errror : 'missing parameters'})
    return
  }

  let uuid = await playerHandling.getPlayerUUID(req.query.username);
  if (!uuid) {
    //Invalid player 
    res.status(404);
    res.json({error : 'User not found'})
    return
  }
  
  let hypixel_data = await playerHandling.getPlayerData(uuid);
  if (hypixel_data.profiles === null){
    res.status(404);
    res.json({error : "User doesn't have a skyblock profile"})
    return
  }
  
  let user_coleweight = await playerHandling.calculateColeweight(hypixel_data, uuid)
  let user_object = await playerHandling.writeToDB(req.query.username, user_coleweight);

  res.status(200);
  res.json(user_object)
  
})


router.get('/rankings', async function(req, res){
  //UGLY ASS PARAMETERS INPUT BECAUSE TIRED
  
  //Inputs will need to be sanitazed to avoid nosql injections. For now it's possible to pass any type and it's not good...
  if (!req.query.start){
    req.query.start = 0;
  }
  if(!req.query.end){
    req.query.end = 0
  }
  let players = await playerModel.find({}).sort({rank : 1}).skip(req.query.start).limit(req.query.end);
  res.json(players)
})

module.exports = router;

