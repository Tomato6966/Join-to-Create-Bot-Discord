const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let os = require("os");
//Start the module
module.exports = client => {
  /** ////////////////////////////////////////// *
   * LOG EVERY TIME THE BOT GETS READY and STATUS CHANGE
   * ////////////////////////////////////////// *
   */
  client.on("ready", () => {
    console.log("BOT IS READY " + client.user.tag)
    change_status(client);
    //loop through the status per each 10 minutes
    setInterval(() => {
      change_status(client);
    }, 10 * 1000);

    function change_status(client) {
      try {
        const promises = [
          client.shard.fetchClientValues('guilds.cache.size'),
          client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')
        ];
        return Promise.all(promises)
          .then(results => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
            for (const shard of client.shard.ids)
              client.user.setActivity(`.help | .setup | #${shard} Shard | ${totalGuilds} Guilds | ${Math.ceil(totalMembers/1000)}k Members`, {
                type: "WATCHING",
                shardID: shard
              });
          })
          .catch(console.error);
      } catch (e) {
        client.user.setActivity(`.help | .setup | #0 Shard | ${client.guilds.cache.size} Guilds | ${Math.ceil(client.users.cache.size/1000)}k Members`, {
          type: "WATCHING",
          shardID: 0
        });
      }
    }
  })

  /** ////////////////////////////////////////// *
   * LOG EVERY SINGLE MESSAGE
   * ////////////////////////////////////////// *
   */
  client.on("message", (message) => {
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
      if (!message.guild.me.hasPermission(required_perms)) {
        return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("❌ Error | I don't have enough Permissions!")
          .setDescription("Please give me just `ADMINISTRATOR`, because I need it to delete Messages, Create Channel and execute all Admin Commands.\n If you don't want to give me them, then those are the exact Permissions which I need: \n> `" + required_perms.join("`, `") + "`")
        )
      }

      //ALL CMDS, yes not looking great but its enough ;)
      if (["h", "help", "cmd"].includes(cmd)) {
        if (!args[0])
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle("These are all Command Groups!")
            .setURL("https://youtu.be/X2yqNtd3COE")
            .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)\n\n*Enter the right Category, to see help for them* Example: \`${prefix}help voice\`\n[\`INVITE ME\`](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot) | [\`Support Server\`](https://discord.gg/wvCp7q88G3) | [\`Website\`](https://milrato.eu) | Developer: \`Tomato#6966\``)
            .addField(`\`${prefix}help general\``, "Shows all general/Information Commands!", true)
            .addField(`\`${prefix}help setup\``, "> *Shows you all Setup related Commands (how to create a setup, etc.)*", true)
            .addField(`\`${prefix}help voice\``, "> *Shows you all Voice Channel (hosted) related Commands*", true)
          )
        switch (args[0].toLowerCase()) {
          case "general":
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle("These are all cmds!")
              .setURL("https://youtu.be/X2yqNtd3COE")
              .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)`)
              .addField(`\`${prefix}help\``, "Shows all available Commands!", true)
              .addField(`\`${prefix}add\``, "> *[Invite](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot) the Bot!*", true)
              .addField(`\`${prefix}support\``, "> *Sends you a Link for the [SUPPORT SERVER](https://discord.gg/wvCp7q88G3) of the Bot!*", true)
              .addField(`\`${prefix}ping\``, "> *Shows the ping of the Bot!*", true)
              .addField(`\`${prefix}uptime\``, "> *Shows the uptime of the Bot!*", true)
              .addField(`\`${prefix}info\``, "> *Shows Information & Stats of the Bot*", true)
              .addField(`\`${prefix}tutorial\``, "> *Gives you a Link to the [Tutorial Video](https://youtu.be/X2yqNtd3COE)*", true)
              .addField(`\`${prefix}source\``, "> *Gives you a Link to the [Source Code on Github](https://youtu.be/X2yqNtd3COE)*", true)
              .setFooter(ee.footertext, ee.footericon)
            )
            break;
          case "setup":
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle("These are all cmds!")
              .setURL("https://youtu.be/X2yqNtd3COE")
              .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)`)
              .addField(`\`${prefix}setup\` --> Follow steps`, "> *Creates a temp. Voice Channel Setup*")
              .addField(`\`${prefix}setupname <ChannelName>\``, "> *Changes the Created temp. Voice Channel's Name!* \n**Note:** *Having \`{user}\` in your Channel name, will replace with the username!*\n" + `Example: \`${prefix}setupname {user}'s VC\``)
              .addField("\u200b", "\u200b")
              .addField(`\`${prefix}setup2\` --> Follow steps`, "> *Creates a (2rd) temp. Voice Channel Setup*")
              .addField(`\`${prefix}setup2name <ChannelName>\``, "> *Changes the (2rd) Created temp. Voice Channel's Name!* \n**Note:** *Having \`{user}\` in your Channel name, will replace with the username!*\n" + `Example: \`${prefix}setupname {user}'s VC\``)
              .addField("\u200b", "\u200b")
              .addField(`\`${prefix}setup3\` --> Follow steps`, "> *Creates a (3rd) temp. Voice Channel Setup*")
              .addField(`\`${prefix}setup3name <ChannelName>\``, "> *Changes the (3rd) Created temp. Voice Channel's Name!* \n**Note:** *Having \`{user}\` in your Channel name, will replace with the username!*\n" + `Example: \`${prefix}setupname {user}'s VC\``)
              .setFooter(ee.footertext, ee.footericon)
            )
            break;
          case "voice":
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle("These are all cmds!")
              .setURL("https://youtu.be/X2yqNtd3COE")
              .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)\n\n** ALL OF THOSE COMMANDS SOON!!!**`)
              .addField(`\`${prefix}lock\``, "Locks the Voice Channel (makes it Private)!", true)
              .addField(`\`${prefix}unlock\``, "> *Unlocks the Voice Channel (makes it public)!*", true)
              .addField(`\`${prefix}kick @User\``, "> *Kicks a User out of Your Channel!*", true)
              .addField(`\`${prefix}ban @User\``, "> *Kicks and Bans a User from Your Channel!*", true)
              .addField(`\`${prefix}unban @User\``, "> *Unbans (trust) a User for Your Channel!*", true)
              .addField(`\`${prefix}trust @User\``, "> *Trusts a User to your Channel!*", true)
              .addField(`\`${prefix}untrust @User\``, "> *Untrusts a User from your Channel!!*", true)
              .addField(`~~\`${prefix}rename <CHANNEL_NAME>\`~~`, "> *~~Renames the Channel Name (20 Sec cooldown)~~* --> Not Yet\n You can rename the Channel, by editing the Channel!", true)
              .addField(`\`${prefix}limit <UserLimit>\``, "> *Set's the Channel's UserLimit (how many can join)*", true)
              .addField(`\`${prefix}bitrate <Bitrate in bits>\``, "> *Set's the Channel's bitrate*", true)
              .addField(`\`${prefix}vcinvite @User [optional message]\``, "> *Invites a User for your Voice Channel*", true)
              .addField(`\`${prefix}promote @User\``, "> *Make someone else owner in your Channel*", true)
              .setFooter(ee.footertext, ee.footericon)
            )
            break;
          default:
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle("These are all Command Groups!")
              .setURL("https://youtu.be/X2yqNtd3COE")
              .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)\n\n*Enter the right Category, to see help for them* Example: \`${prefix}voice\``)
              .addField(`\`${prefix}general\``, "Shows all general/Information Commands!", true)
              .addField(`\`${prefix}setup\``, "> *Shows you all Setup related Commands (how to create a setup, etc.)*", true)
              .addField(`\`${prefix}voice\``, "> *Shows you all Voice Channel (hosted) related Commands*", true)
            )
            break;

        }

      }

      //GENERAL
      else if (cmd === "ping") {
        return message.reply(new Discord.MessageEmbed()
          .setColor(ee.color)
          .setTitle("MY PING:")
          .setDescription(`PONG! \`${client.ws.ping} ms\``)
          .setFooter(ee.footertext, ee.footericon)
        )
      } else if (cmd === "support" || cmd === "server" || cmd === "tutorial" || cmd === "video") {
        message.reply(
          new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setAuthor(`${client.user.username} Support`, client.user.displayAvatarURL(), "https://milrato.eu")
          .setDescription("[\`Join to Support Server\`](https://discord.gg/wvCp7q88G3) to gain help! OR watch the [Tutorial Video](https://youtu.be/X2yqNtd3COE)")
        )
        return;
      } else if (cmd === "info" || cmd === "stats" || cmd === "stat") {

        function duration(ms) {
          const sec = Math.floor((ms / 1000) % 60).toString()
          const min = Math.floor((ms / (1000 * 60)) % 60).toString()
          const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
          const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
          return `\`${days.padStart(1, '0')} Days\`, \`${hrs.padStart(2, '0')} Hours\`, \`${min.padStart(2, '0')} Minutes\`, \`${sec.padStart(2, '0')} Seconds\``
        }
        let totalMembers = client.guilds.cache.reduce((c, g) => c + g.memberCount, 0);

        let totalSetups = 0;
        totalSetups += client.apply.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply2.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply3.filter(s => s.channel_id && s.channel_id.length > 1).size;

        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;
        const embed = new Discord.MessageEmbed()
          .setAuthor(
            `Information about the ${client.user.username} Bot`,
            client.user.displayAvatarURL(), "https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot"
          )
          .setColor(ee.color)
          .addFields({
            name: '🤖 Bot tag',
            value: `**\`${client.user.tag}\`**`,
            inline: true
          }, {
            name: '👾 Version',
            value: `**\`v4.3.6\`**`,
            inline: true
          }, {
            name: "👻 Command prefix",
            value: `**\`e!\`**`,
            inline: true
          }, {
            name: '⏱ Time since last restart',
            value: `**\`${process.uptime().toFixed(2)}s\`**`,
            inline: true
          }, {
            name: '🕐 Uptime',
            value: `**\`${days}d\` \`${hours}h\` \`${minutes}m\` \`${seconds}s\`**`,
            inline: true
          }, {
            name: '📁 Server count',
            value: `**\`${client.guilds.cache.size}\`**`,
            inline: true
          }, {
            name: '📂 Total members',
            value: `**\`${totalMembers}\`**`,
            inline: true
          }, {
            name: '⚙️ Setups created',
            value: `**\`${totalSetups}\`**`,
            inline: true
          })
          .addField("***BOT BY:***", `
            >>> <@442355791412854784> \`Tomato#6966\`[\`Website\`](https://milrato.eu)
              `)
          .addField("***SUPPORT:***", `
              >>> [\`Server\`](https://discord.gg/wvCp7q88G3) | [\`milrato - Website\`](https://milrato.eu) | [\`Invite\`](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot)
                `)

        // oldembed: message.channel.send(embed)
        cpuStat.usagePercent(function(e, percent, seconds) {
          if (e) {
            return console.log(String(e.stack).red);
          }
          let connectedchannelsamount = 0;
          let guilds = client.guilds.cache.map((guild) => guild);
          for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
          }

          const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')
          ];

          return Promise.all(promises)
            .then(async results => {
              const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
              const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
              connectedchannelsamount += 300;
              if (connectedchannelsamount > Number(totalGuilds)) connectedchannelsamount = Number(totalGuilds);
              let guilds = [],
                users = [];
              let countertest = 0;
              for (let item of results[0]) guilds.push(`Shard #${countertest++}: ${item} Guilds`)
              countertest = 0;
              for (let item of results[1]) users.push(`Shard #${countertest++}: ${item} Users`)
              const botinfo = new Discord.MessageEmbed()
                .setAuthor(
                  `Information about the ${client.user.username} Bot`,
                  client.user.displayAvatarURL(), "https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot"
                )
                .setColor(ee.color)
                .addField("⏳ Memory Usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``, true)
                .addField("⌚️ Uptime ", `${duration(client.uptime)}`, true)
                .addField("\u200b", `\u200b`, true)
                .addField("📁 Users", `\`Total: ${totalMembers} Users\`\n\`\`\`fix\n${users.join("\n")}\n\`\`\``, true)
                .addField("📁 Servers", `\`Total: ${totalGuilds} Servers\`\n\`\`\`fix\n${guilds.join("\n")}\n\`\`\``, true)
                .addField("\u200b", `\u200b`, true)
                .addField("📁 Voice-Channels", `\`${client.channels.cache.filter((ch) => ch.type === "voice").size}\``, true)
                .addField("📁 Connected Channels", `\`${connectedchannelsamount}\``, true)
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
                .addField("⚙️ Setups created", `\`${totalSetups} Setups\``, true)
                .addField("***BOT BY:***", `
                    >>> <@442355791412854784> \`Tomato#6966\`[\`Website\`](https://milrato.eu)
                      `)
                .addField("***SUPPORT:***", `
                      >>> [\`Server\`](https://discord.gg/wvCp7q88G3) | [\`milrato - Website\`](https://milrato.eu) | [\`Invite\`](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot)
                        `)
                .setFooter("Coded by:    Tomato#6966");
              message.channel.send(botinfo);
            })
            .catch(console.error);
        });
        return;
      } else if (cmd === "uptime") {
        function duration(ms) {
          const sec = Math.floor((ms / 1000) % 60).toString()
          const min = Math.floor((ms / (1000 * 60)) % 60).toString()
          const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
          const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
          return `\`${days.padStart(1, '0')} Days\`, \`${hrs.padStart(2, '0')} Hours\`, \`${min.padStart(2, '0')} Minutes\`, \`${sec.padStart(2, '0')} Seconds\``
        }
        return message.reply(new Discord.MessageEmbed()
          .setColor(ee.color)
          .setTitle("🕐 | MY UPTIME:")
          .setDescription(`${duration(client.uptime)}`)
          .setFooter(ee.footertext, ee.footericon)
        )
      } else if (cmd === "add" || cmd === "invite") {
        return message.reply(new Discord.MessageEmbed()
          .setColor(ee.color)
          .setURL("https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot")
          .setTitle("❤ | Thanks for every invite!")
          .setDescription(`[Click here to invite me, thanks](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot)`)
          .setFooter(ee.footertext, ee.footericon)
        )
      } else if (cmd === "source" || cmd === "github") {
        message.reply(
          new Discord.MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setAuthor(`${client.user.username}'s' Source Code`, client.user.displayAvatarURL(), "https://milrato.eu")
          .setTitle(`This Bot is made by \`Tomato#6966\` and **this** is the Source Code link to this Bot`)
          .setURL("https://github.com/Milrato-Development/Easiest-Application")
          .addField("Discord.js: ", "[\`v12.5.1\`](https://discord.js.org)", true)
          .addField("Node.js: ", "[\`v15.3.4\`](https://nodejs.org/en/)", true)
          .addField("Enmap: ", "[\`v5.8.4\`](https://enmap.evie.dev/api)", true)
          .addField("Source Code. ", "Don't just use the source for yourself,... please [invite](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot) me too![\`Click here\`](https://github.com/Milrato-Development/Easiest-Application)")

        )
        return;
      }

      //VOICE CMDS
      else if (cmd === "lock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          vc.overwritePermissions([{
              id: message.guild.id,
              allow: ['VIEW_CHANNEL'],
              deny: ['CONNECT'],
            }])
            .then(lol => {
              vc.updateOverwrite(message.author.id, {
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: true,
                CONNECT: true
              })
              return message.reply(new Discord.MessageEmbed()
                .setColor(ee.color)
                .setTitle("✅ LOCKED your Channel!")
                .setDescription(`Noone can join anymore!`)
                .setFooter(ee.footertext, ee.footericon)
              )
            })

        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "unlock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          vc.updateOverwrite(message.guild.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            vc.updateOverwrite(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle("✅ UNLOCKED your Channel!")
              .setDescription(`Everyone can join now!`)
              .setFooter(ee.footertext, ee.footericon)
            )
          })
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "kick") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}kick @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}kick @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          if (!member.voice.channel)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: Your pinged user, is not connected to a Channel")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (member.voice.channel.id != channel.id)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: Your pinged user, is not connected in your Channel")
              .setFooter(ee.footertext, ee.footericon)
            )
          try {
            member.voice.kick();
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Kicked ${member.user.tag} out of your Channel`)
              .setFooter(ee.footertext, ee.footericon)
            )
          } catch (e) {
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: An Error occurred")
              .setDescription(`\`\`\`${e.message}\`\`\``)
              .setFooter(ee.footertext, ee.footericon)
            )
          }
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (["vcinvite", "vcadd", "voiceinvite", "voiceadd"].includes(cmd)) {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}invite @User [optional Message]\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}invite @User [optional Message]\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let txt = args.slice(1).join(" ");
          try {
            channel.createInvite().then(invite => {
              vc.updateOverwrite(member.user.id, {
                VIEW_CHANNEL: true,
                CONNECT: true
              }).then(lol => {
                vc.updateOverwrite(message.author.id, {
                  MANAGE_CHANNELS: true,
                  VIEW_CHANNEL: true,
                  MANAGE_ROLES: true,
                  CONNECT: true
                })
                member.user.send(new Discord.MessageEmbed()
                  .setColor(ee.color)
                  .setTitle(`You got invited to join ${message.author.tag}'s Voice Channel`)
                  .setDescription(`[Click here](${invite.url}) to join **${channel.name}**\n\n${txt ? txt : ""}`.substr(0, 2000))
                  .setFooter(ee.footertext, ee.footericon)
                ).catch(e => {
                  return message.reply(new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`:x: Error | Couldn't Dm \`${member.user.tag}\``)
                    .setDescription(`\`\`\`${e.message}\`\`\``)
                    .setFooter(ee.footertext, ee.footericon)
                  )
                })
              })
              return message.reply(new Discord.MessageEmbed()
                .setColor(ee.color)
                .setTitle(`✅ Invited ${member.user.tag} to your Channel`)
                .setFooter(ee.footertext, ee.footericon)
              )
            })

          } catch (e) {
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: An Error occurred")
              .setDescription(`\`\`\`${e.message}\`\`\``)
              .setFooter(ee.footertext, ee.footericon)
            )
          }
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "ban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}ban @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}ban @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          if (member.voice.channel && member.voice.channel.id == channel.id)
            try {
              member.voice.kick();
              message.reply(new Discord.MessageEmbed()
                .setColor(ee.color)
                .setTitle(`✅ Disconnected ${member.user.tag} out of your Channel`)
                .setFooter(ee.footertext, ee.footericon)
              )
            } catch (e) {
              message.reply(new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(":x: An Error occurred")
                .setDescription(`\`\`\`${e.message}\`\`\``)
                .setFooter(ee.footertext, ee.footericon)
              )
            }
          vc.updateOverwrite(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {
            vc.updateOverwrite(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Banned ${member.user.tag} out from your Channel!`)
              .setFooter(ee.footertext, ee.footericon)
            )
          })


        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "unban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}unban @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}unban @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          vc.updateOverwrite(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            vc.updateOverwrite(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Unbanned ${member.user.tag} from your Channel!`)
              .setDescription("He can now join your Channel again!")
              .setFooter(ee.footertext, ee.footericon)
            )
          })
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "trust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}trust @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}trust @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          vc.updateOverwrite(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            vc.updateOverwrite(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Trusted ${member.user.tag} to your Channel!`)
              .setDescription("He can now join your Channel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          })
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "untrust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}untrust @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}untrust @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          vc.updateOverwrite(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {
            vc.updateOverwrite(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Untrusted ${member.user.tag} from your Channel!`)
              .setDescription("He can now no longer join your Channel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          })
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "limit") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(
            new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to")
          );
          if (isNaN(args[0])) return message.reply(
            new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to | It MUST be a **Numer**")
          );
          let userlimit = Number(args[0]);
          if (userlimit > 99 || userlimit < 0) return message.reply(
            new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: Your included Number is not in the valid Range (`0` - `99`)")
          );
          channel.setUserLimit(userlimit).then(vc => {
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Set User-limit to \`${vc.userLimit}\``)
              .setFooter(ee.footertext, ee.footericon)
            )
          })
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "bitrate") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(
            new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to")
          );
          if (isNaN(args[0])) return message.reply(
            new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to | It MUST be a **Numer**")
          );
          let maxbitrate = 96000;
          let boosts = message.guild.premiumSubscriptionCount;
          if (boosts >= 2) maxbitrate = 128000;
          if (boosts >= 15) maxbitrate = 256000;
          if (boosts >= 30) maxbitrate = 384000;
          let userlimit = Number(args[0]);
          if (userlimit > maxbitrate || userlimit < 8000) return message.reply(
            new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:x: Your included Number is not in the valid Range (\`8000\` - \`${maxbitrate}\`)`)
          );
          channel.setBitrate(userlimit).then(vc => {
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Set the Bitrate to \`${vc.bitrate}\``)
              .setFooter(ee.footertext, ee.footericon)
            )
          })
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      } else if (cmd === "promote") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a VoiceChannel, for this Command")
          .setFooter(ee.footertext, ee.footericon)
        )
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (!owner)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (!args[0]) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}promote @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Please add a User via Ping / ID!")
            .setDescription(`Useage: \`${prefix}promote @User\``)
            .setFooter(ee.footertext, ee.footericon)
          )
          if (!member.voice.channel)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: Your pinged user, is not connected to a Channel")
              .setFooter(ee.footertext, ee.footericon)
            )
          if (member.voice.channel.id != channel.id)
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: Your pinged user, is not connected in your Channel")
              .setFooter(ee.footertext, ee.footericon)
            )
          try {
            vc.updateOverwrite(member.user.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            }).then(l => {
              vc.updateOverwrite(message.author.id, {
                  MANAGE_CHANNELS: false,
                  VIEW_CHANNEL: true,
                  MANAGE_ROLES: false,
                  CONNECT: true
                })
                .then(lol => {
                  return message.reply(new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setTitle(`✅ Promoted ${member.user.tag} to the new Owner of your Channel\nRemoved your permissions`)
                    .setFooter(ee.footertext, ee.footericon)
                  )
                })
            })
          } catch (e) {
            return message.reply(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: An Error occurred")
              .setDescription(`\`\`\`${e.message}\`\`\``)
              .setFooter(ee.footertext, ee.footericon)
            )
          }
        } else {
          return message.reply(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
            .setFooter(ee.footertext, ee.footericon)
          )
        }
      }
      //SETUP COMMANDS
      else if (cmd === "setup") {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!"));
        let {
          channel
        } = message.member.voice;
        if (channel) {
          message.reply(new Discord.MessageEmbed()
            .setTitle("<:ChannelMaster:778404076466602024> Setup Complete for Join to Create")
            .setColor(ee.color)
            .setDescription(`Bound to Channel: \`${channel.name}\`\nPlease rejoin!`)
            .setFooter(ee.footertext, ee.footericon)
          );
          client.settings.set(message.guild.id, channel.id, `channel`);
        } else {
          message.guild.channels.create("Join to Create", {
            type: 'voice',
            bitrate: 8000,
            userLimit: 2,
            permissionOverwrites: [ //update the permissions
              { //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
                id: message.guild.id,
                allow: ['VIEW_CHANNEL', "CONNECT"],
                deny: ["SPEAK"]
              },
            ],
          }).then(vc => {
            if (message.channel.parent) vc.setParent(message.channel.parent.id)
            message.reply(new Discord.MessageEmbed()
              .setTitle("<:ChannelMaster:778404076466602024> Setup Complete for Join to Create")
              .setColor(ee.color)
              .setDescription(`Bound to Channel: \`${vc.name}\`\n\nI created the Channel for you!`)
              .setFooter(ee.footertext, ee.footericon)
            );
            client.settings.set(message.guild.id, vc.id, `channel`);
          })
        }

        return;
      } else if (cmd === "setupname") {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!"));
        if (!args[0]) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You didn't add a Channelname").setDescription(`Useage: \`${prefix}setupname [new Channel Name]\` | Note: {user} will be replaced with username*`));
        if (args[0].length > 32) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: Your provided Channel Name is too Long").setDescription(`The maximum length for a Channel name is \`32\` Letters`));
        client.settings.set(message.guild.id, args.join(" "), "channelname");
        message.reply(new Discord.MessageEmbed()
          .setTitle("<:ChannelMaster:778404076466602024> Successfully changed the Channelname for the temp. Channels")
          .setColor(ee.color)
          .setDescription(`New Channelname: \`${client.settings.get(message.guild.id, "channelname")}\`\n\nWhat it could look like: \`${client.settings.get(message.guild.id, "channelname").replace("{user}", message.author.username)}\``)
          .setFooter(ee.footertext, ee.footericon)
        );
        return;
      } else if (cmd === "setup2") {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!"));
        let {
          channel
        } = message.member.voice;
        if (channel) {
          message.reply(new Discord.MessageEmbed()
            .setTitle("<:ChannelMaster:778404076466602024> Setup 2 Complete for Join to Create")
            .setColor(ee.color)
            .setDescription(`Bound to Channel: \`${channel.name}\`\nPlease rejoin!`)
            .setFooter(ee.footertext, ee.footericon)
          );
          client.settings2.set(message.guild.id, channel.id, `channel`);
        } else {
          message.guild.channels.create("Join to Create", {
            type: 'voice',
            bitrate: 8000,
            userLimit: 2,
            permissionOverwrites: [ //update the permissions
              { //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
                id: message.guild.id,
                allow: ['VIEW_CHANNEL', "CONNECT"],
                deny: ["SPEAK"]
              },
            ],
          }).then(vc => {
            if (message.channel.parent) vc.setParent(message.channel.parent.id)
            message.reply(new Discord.MessageEmbed()
              .setTitle("<:ChannelMaster:778404076466602024> Setup 2 Complete for Join to Create")
              .setColor(ee.color)
              .setDescription(`Bound to Channel: \`${vc.name}\`\n\nI created the Channel for you!`)
              .setFooter(ee.footertext, ee.footericon)
            );
            client.settings2.set(message.guild.id, vc.id, `channel`);
          })
        }

        return;
      } else if (cmd === "setup2name") {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!"));
        if (!args[0]) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You didn't add a Channelname").setDescription(`Useage: \`${prefix}setupname [new Channel Name]\` | Note: {user} will be replaced with username*`));
        if (args[0].length > 32) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: Your provided Channel Name is too Long").setDescription(`The maximum length for a Channel name is \`32\` Letters`));
        client.settings2.set(message.guild.id, args.join(" "), "channelname");
        message.reply(new Discord.MessageEmbed()
          .setTitle("<:ChannelMaster:778404076466602024> Successfully changed the Channelname for the temp. Channels")
          .setColor(ee.color)
          .setDescription(`New Channelname: \`${client.settings2.get(message.guild.id, "channelname")}\`\n\nWhat it could look like: \`${client.settings2.get(message.guild.id, "channelname").replace("{user}", message.author.username)}\``)
          .setFooter(ee.footertext, ee.footericon)
        );
        return;
      } else if (cmd === "setup3") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!"));
        let {
          channel
        } = message.member.voice;
        if (channel) {
          message.reply(new Discord.MessageEmbed()
            .setTitle("<:ChannelMaster:778404076466602024> Setup 3 Complete for Join to Create")
            .setColor(ee.color)
            .setDescription(`Bound to Channel: \`${channel.name}\`\nPlease rejoin!`)
            .setFooter(ee.footertext, ee.footericon)
          );
          client.settings3.set(message.guild.id, channel.id, `channel`);
        } else {
          message.guild.channels.create("Join to Create", {
            type: 'voice',
            bitrate: 8000,
            userLimit: 2,
            permissionOverwrites: [ //update the permissions
              { //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
                id: message.guild.id,
                allow: ['VIEW_CHANNEL', "CONNECT"],
                deny: ["SPEAK"]
              },
            ],
          }).then(vc => {
            if (message.channel.parent) vc.setParent(message.channel.parent.id)
            message.reply(new Discord.MessageEmbed()
              .setTitle("<:ChannelMaster:778404076466602024> Setup 3 Complete for Join to Create")
              .setColor(ee.color)
              .setDescription(`Bound to Channel: \`${vc.name}\`\n\nI created the Channel for you!`)
              .setFooter(ee.footertext, ee.footericon)
            );
            client.settings3.set(message.guild.id, vc.id, `channel`);
          })
        }

        return;
      } else if (cmd === "setup3name") {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!"));
        if (!args[0]) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You didn't add a Channelname").setDescription(`Useage: \`${prefix}setupname [new Channel Name]\` | Note: {user} will be replaced with username*`));
        if (args[0].length > 32) return message.reply(new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: Your provided Channel Name is too Long").setDescription(`The maximum length for a Channel name is \`32\` Letters`));
        client.settings3.set(message.guild.id, args.join(" "), "channelname");
        message.reply(new Discord.MessageEmbed()
          .setTitle("<:ChannelMaster:778404076466602024> Successfully changed the Channelname for the temp. Channels")
          .setColor(ee.color)
          .setDescription(`New Channelname: \`${client.settings3.get(message.guild.id, "channelname")}\`\n\nWhat it could look like: \`${client.settings3.get(message.guild.id, "channelname").replace("{user}", message.author.username)}\``)
          .setFooter(ee.footertext, ee.footericon)
        );
        return;
      } else {
        return message.reply(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle("UNKNOWN CMD")
          .setDescription(`Sorry, i don't know this cmd! Try; \`${prefix}help\``)
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
  });

  /** ////////////////////////////////////////// *
   * INFO MSG ON INVITE
   *  ////////////////////////////////////////// *
   */
  client.on("guildCreate", guild => {
    let channel = guild.channels.cache.find(
      channel =>
      channel.type === "text" &&
      channel.permissionsFor(guild.me).has("SEND_MESSAGES")
    );
    channel.send(new Discord.MessageEmbed()
      .setColor(ee.color)
      .setTitle("These are all cmds!")
      .setURL("https://youtu.be/X2yqNtd3COE")
      .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)`)
      .addField(`\`help\``, "Shows all available Commands!", true)
      .addField(`\`add\``, "> *[Invite](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot) the Bot!*", true)
      .addField(`\`support\``, "> *Sends you a Link for the [SUPPORT SERVER](https://discord.gg/wvCp7q88G3) of the Bot!*", true)
      .addField(`\`ping\``, "> *Shows the ping of the Bot!*", true)
      .addField(`\`uptime\``, "> *Shows the uptime of the Bot!*", true)
      .addField(`\`info\``, "> *Shows Information & Stats of the Bot*", true)
      .addField(`\`tutorial\``, "> *Gives you a Link to the [Tutorial Video](https://youtu.be/X2yqNtd3COE)*", true)
      .addField(`\`source\``, "> *Gives you a Link to the [Source Code on Github](https://youtu.be/X2yqNtd3COE)*", true)

      .addField("\u200b", "\u200b")
      .addField(`\`setup\` --> Follow steps`, "> *Set ups the Application System, maximum of 24 Questions!*")
      .addField(`\`editsetup <"acceptmsg"/"denymsg"/"question"/"role"/"addquestion"> [PARAMETER]\``, "> *Allows you to adjust the accept / deny msgs, or edit each Question. \n If needed you can add another Question / change the ROLE!*")
      .addField("\u200b", "\u200b")
      .addField(`\`setup2\``, "> *Same as Setup 1 just your second Application System!*")
      .addField(`\`editsetup2\``, "> *Same as Setup 1(0) just your second Application System!*")
      .addField(`\`setup3\``, "> *Same as Setup 1(0) just your third Application System!*")
      .addField(`\`editsetup3\``, "> *Same as Setup 1(0) just your third Application System!*")

      .setFooter(ee.footertext, ee.footericon)
    )
    channel.send(new Discord.MessageEmbed()
      .setColor(ee.color)
      .setTitle("Thanks for Inviting me!")
      .setDescription(`To get started, simply type: \`${prefix}setup\` and follow the steps!`)
      .setFooter(ee.footertext, ee.footericon)
    )
    channel.send("**Here is a TUTORIAL VIDEO:**\nhttps://youtu.be/X2yqNtd3COE")
  })

}

/** ////////////////////////////////////////// *
 * FUNCTION FOR ENSURING THE databases
 * ////////////////////////////////////////// *
 */
function databasing(guildid, client) {
  client.settings.ensure(guildid, {
    prefix: ".",
    channel: "",
    channelname: "{user}' Room",
    guild: guildid,
  });
  client.settings2.ensure(guildid, {
    channel: "",
    channelname: "{user}' Channel",
    guild: guildid,
  });
  client.settings3.ensure(guildid, {
    channel: "",
    channelname: "{user}' Lounge",
    guild: guildid,
  });
}


/** ////////////////////////////////////////// *
 * FUNCTION FOR CHECKING THE PREFIX !
 * ////////////////////////////////////////// *
 */
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {

  }
}
