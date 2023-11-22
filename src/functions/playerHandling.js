const playerModel = require('../models/player.js');
const config = require('../../config.json')
const cwinfo = require('../../cwinfo.json')
const mongoose = require('mongoose');

async function getPlayerUUID(username){
  //Since we store the UUID in the database to reduce requests to Mojang API we need to check if it exists before querying.
  try {
    let player = await playerModel.findOne({username : username})
    if (!player){
      //Need to get the UUID from mojang
      let response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
      response = await response.json()
      if (response.errorMessage){
        //Need to do error handling
        console.log('error')
        return
      }
      //Create new player in db
      let new_player = new playerModel({
        username : username,
        uuid : response.id,
        history : [{historic_date : Date.now(), coleweight : 0, mining_xp : 0}]
      })
      await new_player.save();

      console.log('worked')

      console.log(response)
      return response.id
    }else {
      return player.uuid
    }
  }catch(e){
    console.log(e.message)
    //Error handling needed
  }
}

async function getPlayerData(uuid){
  let response = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, {
    headers : {
      "API-Key": config.api_key
    }
  })
  return await response.json()



}

async function calculateColeweight(playerData, uuid){
  //Let's try to calculate for each values, store in DB and add total
  let mining_xp = 0;
  let active_player;
  //We find the profile with the highest mining xp 
  for (let profile of playerData.profiles){
    let player = profile.members[uuid];
    if (player.player_data.experience == undefined) {
      continue;
    }
    let current_profile_xp = player.player_data.experience.SKILL_MINING
    if (current_profile_xp > mining_xp){
      mining_xp = current_profile_xp // THIS SUCKS KILL ME 
      active_player = player

    }
  }
  let mithril_powder = active_player.mining_core.powder_mithril_total + active_player.mining_core.powder_spent_mithril
  let gemstone_powder = active_player.mining_core.powder_gemstone_total + active_player.mining_core.powder_spent_gemstone
  let total = 0;
  let coleweight = {

    mining_xp : {amount : mining_xp, value : mining_xp / cwinfo.mining_xp},
    mithril_powder :{amount : mithril_powder, value : mithril_powder / cwinfo.mithril_powder},
    gemstone_powder : {amount : gemstone_powder, value : gemstone_powder / cwinfo.gemstone_powder},
    nucleus_runs : {amount : active_player.mining_core.crystals.jade_crystal.total_placed, value : active_player.mining_core.crystals.jade_crystal.total_placed / cwinfo.nucleus_runs} ,
    collections : [],
    kills : [],
  }
  //Loop through collections and kills and get values from the name inside the config
  for (let collection of cwinfo.collections){

    let value =  active_player.collection[collection.name] / collection.cost
    if (value == undefined || isNaN(value)) {
      continue;
    }
    total += value
    coleweight.collections.push({
      name : collection.name,
      value : value,
      amount : active_player.collection[collection.name]

    })
  }

  for (let kill of cwinfo.kills){
    let value = active_player.bestiary.kills[kill.name] / kill.cost
    if (value == undefined || isNaN(value)) {
      continue;
    }
    total += value
    coleweight.kills.push({
      name : kill.name,
      value : value,
      amount : active_player.bestiary.kills[kill.name]
    })
  }

  total += coleweight.mining_xp.value;
  total += coleweight.mithril_powder.value;
  total += coleweight.gemstone_powder.value;
  total += coleweight.nucleus_runs.value;

  return {
    total, 
    coleweight

  }
}

//NEEDS REWRITE BECAUSE BAD
async function writeToDB(username,  coleweight_data){
  //This makes me want to kill myself. Can't bother passing objects back into this function for now.


  //Normally we know that the user already exists since we create it if we can't find UUID 

  //Counting players with a coleweight greater than the user to determine ranking.
  let players_above = await playerModel.countDocuments({coleweight : {$gt : coleweight_data.total}})


  let player_object = await playerModel.findOneAndUpdate({username : username}, {...coleweight_data.coleweight, coleweight: coleweight_data.total, rank : players_above + 1}, {new: true})

  //Let's check for history changes and add to the array if needed.
  if (player_object.history.slice(-1)[0].coleweight !== coleweight_data.coleweight){
    //Coleweight have been updated since last time.
    var oneDay = 24 * 60 * 60 * 1000
    console.log(Date.parse(player_object.history.slice(-1)[0].historic_date))
    if (Date.now() - Date.parse(player_object.history.slice(-1)[0].historic_date) > oneDay ){
      //It's been more than one day since the last database historic save.
      player_object.history.push({historic_date : Date.now(), coleweight : coleweight_data.coleweight, mining_xp : coleweight_data.coleweight.mining_xp.amount})
    }
  }

  await player_object.save()
  return player_object



}





module.exports = {getPlayerUUID, getPlayerData, calculateColeweight, writeToDB}
