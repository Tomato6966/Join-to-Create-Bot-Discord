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
module.exports = (client, message, args, cmd, prefix) => {
  if (cmd === "lock") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);

    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      vc.permissionOverwrites.set([{
        id: message.guild.id,
        allow: ['VIEW_CHANNEL'],
        deny: ['CONNECT']
      }])
        .then(lol => {
          vc.permissionOverwrites.create(message.author.id, {
            MANAGE_CHANNELS: true,
            VIEW_CHANNEL: true,
            MANAGE_ROLES: true,
            CONNECT: true
          })
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle("✅ LOCKED your Channel!")
              .setDescription(`Noone can join anymore!`)
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        })

    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "unlock") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      vc.permissionOverwrites.create(message.guild.id, {
        VIEW_CHANNEL: true,
        CONNECT: true
      }).then(lol => {
        vc.permissionOverwrites.create(message.author.id, {
          MANAGE_CHANNELS: true,
          VIEW_CHANNEL: true,
          MANAGE_ROLES: true,
          CONNECT: true
        });
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle("✅ UNLOCKED your Channel!")
            .setDescription(`Everyone can join now!`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "kick") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`))
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}kick @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member || member == null || member == undefined) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}kick @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      if (!member.voice.channel)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Your pinged user, is not connected to a Channel")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (member.voice.channel.id != channel.id)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Your pinged user, is not connected in your Channel")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      try {
        member.voice.disconnect();
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`✅ Kicked ${member.user.tag} out of your Channel`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      } catch (e) {
        console.log(String(e.stack).bgRed);
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: An Error occurred")
            .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      }
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (["vcinvite", "vcadd", "voiceinvite", "voiceadd"].includes(cmd)) {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}invite @User [optional Message]\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member || member == null || member == undefined) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}invite @User [optional Message]\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let txt = args.slice(1).join(" ");
      try {
        channel.createInvite().then(invite => {
          vc.permissionOverwrites.create(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            vc.permissionOverwrites.create(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            });
            member.user.send({
              embeds: [new Discord.MessageEmbed()
                .setColor(ee.color)
                .setTitle(`You got invited to join ${message.author.tag}'s Voice Channel`)
                .setDescription(`[Click here](${invite.url}) to join **${channel.name}**\n\n${txt ? txt : ""}`.substr(0, 2000))
                .setFooter(ee.footertext, ee.footericon)
              ]
            }).catch(e => {
              console.log(String(e.stack).bgRed);
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setTitle(`:x: Error | Couldn't Dm \`${member.user.tag}\``)
                  .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
                  .setFooter(ee.footertext, ee.footericon)
                ]
              })
            })
          });
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Invited ${member.user.tag} to your Channel`)
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        })

      } catch (e) {
        console.log(String(e.stack).bgRed);
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: An Error occurred")
            .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      }
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "ban") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}ban @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member || member == null || member == undefined) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}ban @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      if (member.voice.channel && member.voice.channel.id == channel.id)
        try {
          member.voice.disconnect();
          message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.color)
              .setTitle(`✅ Disconnected ${member.user.tag} out of your Channel`)
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        } catch (e) {
          console.log(String(e.stack).bgRed);
          message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(":x: An Error occurred")
              .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
              .setFooter(ee.footertext, ee.footericon)
            ]
          })
        };
      vc.permissionOverwrites.create(member.user.id, {
        VIEW_CHANNEL: true,
        CONNECT: false
      }).then(lol => {
        vc.permissionOverwrites.create(message.author.id, {
          MANAGE_CHANNELS: true,
          VIEW_CHANNEL: true,
          MANAGE_ROLES: true,
          CONNECT: true
        });
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`✅ Banned ${member.user.tag} out from your Channel!`)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })


    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "unban") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}unban @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member || member == null || member == undefined) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}unban @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      vc.permissionOverwrites.create(member.user.id, {
        VIEW_CHANNEL: true,
        CONNECT: true
      }).then(lol => {
        vc.permissionOverwrites.create(message.author.id, {
          MANAGE_CHANNELS: true,
          VIEW_CHANNEL: true,
          MANAGE_ROLES: true,
          CONNECT: true
        });
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`✅ Unbanned ${member.user.tag} from your Channel!`)
            .setDescription("He can now join your Channel again!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "trust") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}trust @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member || member == null || member == undefined) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}trust @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      vc.permissionOverwrites.create(member.user.id, {
        VIEW_CHANNEL: true,
        CONNECT: true
      }).then(lol => {
        vc.permissionOverwrites.create(message.author.id, {
          MANAGE_CHANNELS: true,
          VIEW_CHANNEL: true,
          MANAGE_ROLES: true,
          CONNECT: true
        });
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`✅ Trusted ${member.user.tag} to your Channel!`)
            .setDescription("He can now join your Channel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "untrust") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}untrust @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member || member == null || member == undefined) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}untrust @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      vc.permissionOverwrites.create(member.user.id, {
        VIEW_CHANNEL: true,
        CONNECT: false
      }).then(lol => {
        vc.permissionOverwrites.create(message.author.id, {
          MANAGE_CHANNELS: true,
          VIEW_CHANNEL: true,
          MANAGE_ROLES: true,
          CONNECT: true
        });
        message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`✅ Untrusted ${member.user.tag} from your Channel!`)
            .setDescription("He can now no longer join your Channel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "limit") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to")
        ]
      });
      if (isNaN(args[0])) return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to | It MUST be a **Numer**")
        ]
      });
      let userlimit = Number(args[0]);
      if (userlimit > 99 || userlimit < 0) return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: Your included Number is not in the valid Range (`0` - `99`)")
        ]
      });
      channel.setUserLimit(userlimit).then(vc => {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`✅ Set User-limit to \`${vc.userLimit}\``)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "bitrate") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to")
        ]
      });
      if (isNaN(args[0])) return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(":x: You have to include the limit you want to set to | It MUST be a **Numer**")
        ]
      });
      let maxbitrate = 96000;
      let boosts = message.guild.premiumSubscriptionCount;
      if (boosts >= 2) maxbitrate = 128000;
      if (boosts >= 15) maxbitrate = 256000;
      if (boosts >= 30) maxbitrate = 384000;
      let userlimit = Number(args[0]);
      if (userlimit > maxbitrate || userlimit < 8000) return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:x: Your included Number is not in the valid Range (\`8000\` - \`${maxbitrate}\`)`)
        ]
      });
      channel.setBitrate(userlimit).then(vc => {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(`✅ Set the Bitrate to \`${vc.bitrate}\``)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      })
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  } else if (cmd === "promote") {
    let {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(":x: You have to be in a VoiceChannel, for this Command")
        .setFooter(ee.footertext, ee.footericon)
      ]
    });
    client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false);
    client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
      var vc = message.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`));
      let perms = vc.permissionsFor(message.author.id);
      let owner = false;
      for (let i = 0; i < perms.length; i++) {
        if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true
      };
      if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
      if (!owner)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: You have to be the Owner of the **temp.** VoiceChannel!")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (!args[0]) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}promote @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member || member == null || member == undefined) return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: Please add a User via Ping / ID!")
          .setDescription(`Useage: \`${prefix}promote @User\``)
          .setFooter(ee.footertext, ee.footericon)
        ]
      });
      if (!member.voice.channel)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Your pinged user, is not connected to a Channel")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      if (member.voice.channel.id != channel.id)
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: Your pinged user, is not connected in your Channel")
            .setFooter(ee.footertext, ee.footericon)
          ]
        });
      try {
        vc.permissionOverwrites.create(member.user.id, {
          MANAGE_CHANNELS: true,
          VIEW_CHANNEL: true,
          MANAGE_ROLES: true,
          CONNECT: true
        }).then(l => {
          vc.permissionOverwrites.create(message.author.id, {
            MANAGE_CHANNELS: false,
            VIEW_CHANNEL: true,
            MANAGE_ROLES: false,
            CONNECT: true
          })
            .then(lol => {
              client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, member.user.id);
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setColor(ee.color)
                  .setTitle(`✅ Promoted ${member.user.tag} to the new Owner of your Channel\nRemoved your permissions!`)
                  .setFooter(ee.footertext, ee.footericon)
                ]
              })
            })
        })
      } catch (e) {
        console.log(String(e.stack).bgRed);
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(":x: An Error occurred")
            .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
            .setFooter(ee.footertext, ee.footericon)
          ]
        })
      }
    } else {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(":x: You have to be in a **temp.** VoiceChannel, for this Command!")
          .setFooter(ee.footertext, ee.footericon)
        ]
      })
    }
  }
};