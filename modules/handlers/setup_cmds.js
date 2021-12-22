//IMPORT FILE DATA
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { databasing, escapeRegex } = require("../../modules/functions")
//import the Discord Library
const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
let os = require("os");
// HERE THE EVENT STARTS
module.exports = (client, message, args, cmd, prefix) => {
  if (cmd === "setup") {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    let {
      channel
    } = message.member.voice;
    if (channel) {
      message.reply({
        embeds: [new Discord.MessageEmbed()
          .setTitle("<:ChannelMaster:778404076466602024> Setup Complete for Join to Create")
          .setColor(ee.color)
          .setDescription(`Bound to Channel: \`${channel.name}\`\nPlease rejoin!`)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      client.settings.set(message.guild.id, channel.id, `channel`)
    } else {
      message.guild.channels.create("Join to Create", {
        type: 'GUILD_VOICE',
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
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setTitle("<:ChannelMaster:778404076466602024> Setup Complete for Join to Create")
            .setColor(ee.color)
            .setDescription(`Bound to Channel: \`${vc.name}\`\n\nI created the Channel for you!`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
        client.settings.set(message.guild.id, vc.id, `channel`);
      })
    };

    return
  } else if (cmd === "setupname") {

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    if (!args[0]) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You didn't add a Channelname").setDescription(`Useage: \`${prefix}setupname [new Channel Name]\` | Note: {user} will be replaced with username*`)] });
    if (args[0].length > 32) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: Your provided Channel Name is too Long").setDescription(`The maximum length for a Channel name is \`32\` Letters`)] });
    client.settings.set(message.guild.id, args.join(" "), "channelname");
    message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle("<:ChannelMaster:778404076466602024> Successfully changed the Channelname for the temp. Channels")
        .setColor(ee.color)
        .setDescription(`New Channelname: \`${client.settings.get(message.guild.id, "channelname")}\`\n\nWhat it could look like: \`${client.settings.get(message.guild.id, "channelname").replace("{user}", message.author.username)}\``)
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    return;
  } else if (cmd === "setup2") {

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    let {
      channel
    } = message.member.voice;
    if (channel) {
      message.reply({
        embeds: [new Discord.MessageEmbed()
          .setTitle("<:ChannelMaster:778404076466602024> Setup 2 Complete for Join to Create")
          .setColor(ee.color)
          .setDescription(`Bound to Channel: \`${channel.name}\`\nPlease rejoin!`)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      client.settings2.set(message.guild.id, channel.id, `channel`);
    } else {
      message.guild.channels.create("Join to Create", {
        type: 'GUILD_VOICE',
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
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setTitle("<:ChannelMaster:778404076466602024> Setup 2 Complete for Join to Create")
            .setColor(ee.color)
            .setDescription(`Bound to Channel: \`${vc.name}\`\n\nI created the Channel for you!`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
        client.settings2.set(message.guild.id, vc.id, `channel`);
      })
    }

    return;
  } else if (cmd === "setup2name") {

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    if (!args[0]) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You didn't add a Channelname").setDescription(`Useage: \`${prefix}setupname [new Channel Name]\` | Note: {user} will be replaced with username*`)] });
    if (args[0].length > 32) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: Your provided Channel Name is too Long").setDescription(`The maximum length for a Channel name is \`32\` Letters`)] });
    client.settings2.set(message.guild.id, args.join(" "), "channelname");
    message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle("<:ChannelMaster:778404076466602024> Successfully changed the Channelname for the temp. Channels")
        .setColor(ee.color)
        .setDescription(`New Channelname: \`${client.settings2.get(message.guild.id, "channelname")}\`\n\nWhat it could look like: \`${client.settings2.get(message.guild.id, "channelname").replace("{user}", message.author.username)}\``)
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    return;
  } else if (cmd === "setup3") {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    let {
      channel
    } = message.member.voice;
    if (channel) {
      message.reply({
        embeds: [new Discord.MessageEmbed()
          .setTitle("<:ChannelMaster:778404076466602024> Setup 3 Complete for Join to Create")
          .setColor(ee.color)
          .setDescription(`Bound to Channel: \`${channel.name}\`\nPlease rejoin!`)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      client.settings3.set(message.guild.id, channel.id, `channel`);
    } else {
      message.guild.channels.create("Join to Create", {
        type: 'GUILD_VOICE',
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
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setTitle("<:ChannelMaster:778404076466602024> Setup 3 Complete for Join to Create")
            .setColor(ee.color)
            .setDescription(`Bound to Channel: \`${vc.name}\`\n\nI created the Channel for you!`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
        client.settings3.set(message.guild.id, vc.id, `channel`);
      })
    }

    return;
  } else if (cmd === "setup3name") {

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You don't have enough Permissions!")] });
    if (!args[0]) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: You didn't add a Channelname").setDescription(`Useage: \`${prefix}setupname [new Channel Name]\` | Note: {user} will be replaced with username*`)] });
    if (args[0].length > 32) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(":x: Your provided Channel Name is too Long").setDescription(`The maximum length for a Channel name is \`32\` Letters`)] });
    client.settings3.set(message.guild.id, args.join(" "), "channelname");
    message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle("<:ChannelMaster:778404076466602024> Successfully changed the Channelname for the temp. Channels")
        .setColor(ee.color)
        .setDescription(`New Channelname: \`${client.settings3.get(message.guild.id, "channelname")}\`\n\nWhat it could look like: \`${client.settings3.get(message.guild.id, "channelname").replace("{user}", message.author.username)}\``)
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    return;
  }
}