//import shardingmanager
const {
  ShardingManager
} = require("discord.js");
//import config file
const config = require("./botconfig/config.json")
//load the shards
const shards = new ShardingManager("./index.js", {
  token: config.token,
  totalShards: 2,
});
//log if a shard created
shards.on("shardCreate", shard => console.log(` || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Launched Shard #${shard.id} || <==> ||`.green))
//spawn the shards
shards.spawn(shards.totalShards, 10000);
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
