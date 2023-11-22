const express = require('express');
const router = express.Router()
const playerModel = require('../models/player');
//Theses routes are for dev purposes only. Quick database manipulation in order to avoid using mongosh.

router.get('/deleteall', async function(req, res){
  await playerModel.deleteMany({})
  res.send("deleted player db ")
})

module.exports = router;
