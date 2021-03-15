//IMPORT FILE DATA
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const {
  databasing,
  escapeRegex
} = require("../../modules/functions")
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let os = require("os");
// HERE THE EVENT STARTS
module.exports = (client, message) => {

  //if message from a bot, or not in a guild return error
  if (message.author.bot || !message.guild) return;
  try {
    //ensure the databases
    databasing(message.guild.id, client)
    //get the prefix from the config.json file
    let prefix = config.prefix;
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    //if its not that then return
    if (!prefixRegex.test(message.content)) return;
    //now define the right prefix either ping or not ping
    const [, matchedPrefix] = message.content.match(prefixRegex);
    //create the arguments with sliceing of of the rightprefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift().toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0) {
      if (matchedPrefix.includes(client.user.id))
        return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`Hugh? I got pinged? Imma give you some help`)
          .setDescription(`To see all Commands type: \`${prefix}help\`\n\nTo setup an Application System type: \`${prefix}setup\`\n\nYou can edit the setup by running: \`${prefix}editsetup\`\n\n*There are 2 other setups just add Number 2/3 to the end of setup like that: \`${prefix}setup2\`/\`${prefix}setup3\`*`)
        );
      return;
    }

    //if the Bot has not enough permissions return error
    let required_perms = ["MANAGE_CHANNELS", , "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
    if (!message.guild.me.hasPermission(required_perms) && cmd != "help") {
      if (message.guild.me.hasPermission("EMBED_LINKS")) {
        return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("❌ Error | I don't have enough Permissions!")
          .setDescription("Please give me just `ADMINISTRATOR`, because I need it to delete Messages, Create Channel and execute all Admin Commands.\n If you don't want to give me them, then those are the exact Permissions which I need: \n> `" + required_perms.join("`, `") + "`")
        )
      } else {
        return message.channel.send("❌ Error | I don't have enough Permissions! Please give me just `ADMINISTRATOR`, because I need it to delete Messages, Create Channel and execute all Admin Commands.\n If you don't want to give me them, then those are the exact Permissions which I need: \n> `" + required_perms.join("`, `") + "`")
      }

    }

    //ALL CMDS, yes not looking great but its enough ;)
    if (["h", "help", "cmd"].includes(cmd)) 
      require("../../modules/handlers/help_cmd")(client, message, args, cmd, prefix)
    
    //fire a general command
    else if (client.category.general.includes(cmd))
      require("../../modules/handlers/general_cmds")(client, message, args, cmd, prefix)

    //fire a voice command
    else if (client.category.voice.includes(cmd))
      require("../../modules/handlers/voice_cmds")(client, message, args, cmd, prefix)

    //fire a setup command
    else if (client.category.setup.includes(cmd))
      require("../../modules/handlers/setup_cmds")(client, message, args, cmd, prefix)

    else {
      return message.reply(new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle("UNKNOWN CMD")
        .setDescription(`Sorry, i don't know this cmd! Try: \`${prefix}help\``)
        .setFooter(ee.footertext, ee.footericon)
      )
    }
  } catch (e) {
    console.log(e)
    message.channel.send(new Discord.MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle("ERROR | ERROR")
      .setDescription("```" + e.message + "```")
    ).then(msg => msg.delete({
      timeout: 7500
    }))
  }

}