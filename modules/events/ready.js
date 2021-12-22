//IMPORT FILE DATA
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { databasing, escapeRegex, change_status } = require("../../modules/functions");
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let os = require("os");
// HERE THE EVENT STARTS
module.exports = (client) => {
    console.log("BOT IS READY " + client.user.tag)
    change_status(client);
    //loop through the status per each 10 minutes
    setInterval(() => {
        change_status(client);
    }, 10 * 1000)
};