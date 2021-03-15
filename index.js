//import the Discord Library
const Discord = require("discord.js");
const colors = require("colors");
//create a new Client
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  disableMentions: "all",
  messageCacheMaxSize: 10,
  messageEditHistoryMaxSize: 10,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  shards: "auto",
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
//import the config.json file
const config = require("./botconfig/config.json")
//import our databasing system
const Enmap = require("enmap");
//create all 3 different databases for each application system
client.settings = new Enmap({
  name: "settings",
  dataDir: "./dbs/1"
});
client.settings2 = new Enmap({
  name: "settings",
  dataDir: "./dbs/2"
});
client.settings3 = new Enmap({
  name: "settings",
  dataDir: "./dbs/3"
});
client.jointocreatemap = new Enmap({
  name: "settings",
  dataDir: "./dbs/jointocreatemap"
}); //for the temp channels
//LOAD EACH MODULE FOR CMDS AND APPLIES,
require(`./modules/cmds`)(client);
require(`./modules/jointocreate`)(client);
//login to the BOT
client.login(config.token);
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
