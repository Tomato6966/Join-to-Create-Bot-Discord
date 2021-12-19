//IMPORT FILE DATA
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const {
  databasing,
  escapeRegex
} = require("../../modules/functions");
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let os = require("os");
// HERE THE EVENT STARTS
module.exports = (client, message, args, cmd, prefix) => {
  if (cmd === "ping") {
    return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setTitle("MY PING:")
        .setDescription(`PONG! \`${client.ws.ping} ms\``)
        .setFooter(ee.footertext, ee.footericon)
      ]
    })
  } else if (cmd === "support" || cmd === "server" || cmd === "tutorial" || cmd === "video") {
    message.reply({
      embeds: [
        new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setAuthor(`${client.user.username} Support`, client.user.displayAvatarURL(), "https://milrato.eu")
          .setDescription("[\`Join to Support Server\`](https://discord.gg/milrato) to gain help! OR watch the [Tutorial Video](https://youtu.be/zNE8insVgOA)")
      ]
    })
    return;
  } else if (cmd === "info" || cmd === "stats" || cmd === "stat" || cmd === "botinfo") {

    cpuStat.usagePercent(function (e, percent, seconds) {
      try {
        if (e) return console.log(String(e.stack).red);

        let totalSetups = 0;
        totalSetups += client.settings.filter(s => s.channel && s.channel.length > 1).size;
        totalSetups += client.settings2.filter(s => s.channel && s.channel.length > 1).size;
        totalSetups += client.settings3.filter(s => s.channel && s.channel.length > 1).size;

        const botinfo = new Discord.MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setTitle("__**Stats:**__")
          .setColor(ee.color)
          .addField("⏳ Memory Usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``, true)
          .addField("⌚️ Uptime ", `${duration(client.uptime)}`, true)
          .addField("\u200b", `\u200b`, true)
          .addField("📁 Users", `\`Total: ${client.users.cache.size} Users\``, true)
          .addField("📁 Servers", `\`Total: ${client.guilds.cache.size} Servers\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("📁 Voice-Channels", `\`${client.channels.cache.filter((ch) => ch.type === "voice").size}\``, true)
          .addField("⚙️ Setups", `\`${totalSetups} Setups\` created`, true)
          .addField("\u200b", `\u200b`, true)
          .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
          .addField("🤖 Node", `\`${process.version}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("🤖 CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
          .addField("🤖 CPU usage", `\`${percent.toFixed(2)}%\``, true)
          .addField("🤖 Arch", `\`${os.arch()}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("💻 Platform", `\`\`${os.platform()}\`\``, true)
          .addField("API Latency", `\`${client.ws.ping}ms\``, true)
          .setFooter("Coded by:    Tomato#6966");
        message.channel.send({ embeds: [botinfo] });

      } catch {
        const botinfo = new Discord.MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setTitle("__**Stats:**__")
          .setColor(ee.color)
          .addField("⏳ Memory Usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``, true)
          .addField("⌚️ Uptime ", `${duration(client.uptime)}`, true)
          .addField("\u200b", `\u200b`, true)
          .addField("📁 Users", `\`Total: ${client.users.cache.size} Users\``, true)
          .addField("📁 Servers", `\`Total: ${client.guilds.cache.size} Servers\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("📁 Voice-Channels", `\`${client.channels.cache.filter((ch) => ch.type === "voice").size}\``, true)
          .addField("⚙️ Setups", `\`${totalSetups} Setups\` created`, true)
          .addField("\u200b", `\u200b`, true)
          .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
          .addField("🤖 Node", `\`${process.version}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("🤖 CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
          .addField("🤖 CPU usage", `\`${percent.toFixed(2)}%\``, true)
          .addField("🤖 Arch", `\`${os.arch()}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("💻 Platform", `\`\`${os.platform()}\`\``, true)
          .addField("API Latency", `\`${client.ws.ping}ms\``, true)
          .setFooter("Coded by:    Tomato#6966");
        message.channel.send({ embeds: [botinfo] });
      }
    })

    function duration(ms) {
      const sec = Math.floor((ms / 1000) % 60).toString()
      const min = Math.floor((ms / (1000 * 60)) % 60).toString()
      const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
      const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
      return `\`${days.padStart(1, '0')} Days\`, \`${hrs.padStart(2, '0')} Hours\`, \`${min.padStart(2, '0')} Minutes\`, \`${sec.padStart(2, '0')} Seconds\``
    }
    return
  } else if (cmd === "uptime") {
    function duration(ms) {
      const sec = Math.floor((ms / 1000) % 60).toString()
      const min = Math.floor((ms / (1000 * 60)) % 60).toString()
      const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
      const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
      return `\`${days.padStart(1, '0')} Days\`, \`${hrs.padStart(2, '0')} Hours\`, \`${min.padStart(2, '0')} Minutes\`, \`${sec.padStart(2, '0')} Seconds\``
    }
    return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setTitle("🕐 | MY UPTIME:")
        .setDescription(`${duration(client.uptime)}`)
        .setFooter(ee.footertext, ee.footericon)
      ]
    })
  } else if (cmd === "add" || cmd === "invite") {
    return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
        .setTitle("❤ | Thanks for every invite!")
        .setDescription(`[Click here to invite me, thanks](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`)
        .setFooter(ee.footertext, ee.footericon)
      ]
    })
  } else if (cmd === "source" || cmd === "github") {
    message.reply({
      embeds: [
        new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setAuthor(`${client.user.username}'s' Source Code`, client.user.displayAvatarURL(), "https://milrato.eu")
          .setTitle(`This Bot is made by \`Tomato#6966\` and **this** is the Source Code link to this Bot`)
          .setURL("https://github.com/Milrato-Development/Channel-Master")
          .addField("Discord.js: ", `[\`${Discord.version}\`](https://discord.js.org)`, true)
          .addField("Node.js: ", `[\`${process.version}\`](https://nodejs.org/en/)`, true)
          .addField("Enmap: ", "[\`v5.8.7\`](https://enmap.evie.dev/api)", true)
          .addField("Source Code. ", "Don't just use the source for yourself,... please [invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) me too![\`Click here\`](https://github.com/Milrato-Development/Channel-Master)")

      ]
    })
    return
  } else if (cmd === "prefix") {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    if (!args[0]) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You didn't add a Prefix").setDescription(`Useage: \`${prefix}prefix <newprefix>\``)] });
    if (args[0].length > 5) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: Your provided Prefix is too Long").setDescription(`The maximum length for a Prefix is \`5\` Letters`)] });
    client.settings.set(message.guild.id, args[0], "prefix");
    return message.reply({
      embeds: [
        new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon)
          .setTitle("<:ChannelMaster:778404076466602024> Successfully changed the Prefix for the bot")
          .setDescription(`New Prefix: \`${client.settings.get(message.guild.id, "prefix")}\``)
      ]
    })
  }
};