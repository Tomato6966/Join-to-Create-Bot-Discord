const {
  MessageEmbed,
  Collection
} = require("discord.js");
const config = require("../botconfig/config.json");
const kernelsettings = require("../botconfig/settings.json");
const ee = require("../botconfig/embed.json");
const { databasing, check_voice_channels, create_join_to_create_Channel } = require("../modules/functions");
module.exports = function (client) {
  //create a variable for the map
  console.log(` :: ⬜️ Module: jointocreate`);

  client.on("ready", () => {
    check_voice_channels(client);
    setInterval(() => check_voice_channels(client), config.check_all_channels_Interval_in_seconds * 1000)
  });

  //voice state update event to check joining/leaving channels
  client.on("voiceStateUpdate", (oldState, newState) => {
    //LOGS FOR EVERYTHING EXCEPT JOINING / LEAVING / SWITCHING
    if (kernelsettings.voice_log_console) {
      if (!oldState.streaming && newState.streaming) return console.log(`${newState.member.user.tag} Is now ${newState.streaming ? "streaming" : "not streaming"}`.gray);
      if (oldState.streaming && !newState.streaming) return console.log(`${newState.member.user.tag} Is now ${newState.streaming ? "streaming)" : "not streaming)"}`.gray);
      if (!oldState.serverDeaf && newState.serverDeaf) return console.log(`${newState.member.user.tag} Is now ${newState.serverDeaf ? "deafed (Server)" : "undeafed (Server)"}`.gray);
      if (oldState.serverDeaf && !newState.serverDeaf) return console.log(`${newState.member.user.tag} Is now ${newState.serverDeaf ? "deafed (Server)" : "undeafed (Server)"}`.gray);
      if (!oldState.serverMute && newState.serverMute) return console.log(`${newState.member.user.tag} Is now ${newState.serverMute ? "muted (Server)" : "unmuted (Server)"}`.gray);
      if (oldState.serverMute && !newState.serverMute) return console.log(`${newState.member.user.tag} Is now ${newState.serverMute ? "muted (Server)" : "unmuted (Server)"}`.gray);
      if (!oldState.selfDeaf && newState.selfDeaf) return console.log(`${newState.member.user.tag} Is now ${newState.selfDeaf ? "deafed (self)" : "undeafed (self)"}`.gray);
      if (oldState.selfDeaf && !newState.selfDeaf) return console.log(`${newState.member.user.tag} Is now ${newState.selfDeaf ? "deafed (self)" : "undeafed (self)"}`.gray);
      if (!oldState.selfMute && newState.selfMute) return console.log(`${newState.member.user.tag} Is now ${newState.selfMute ? "muted (self)" : "unmuted (self)"}`.gray);
      if (oldState.selfMute && !newState.selfMute) return console.log(`${newState.member.user.tag} Is now ${newState.selfMute ? "muted (self)" : "unmuted (self)"}`.gray);
      if (oldState.sessionId != newState.sessionId) console.log(`${newState.member.user.tag} sessionID Is now on: ${newState.sessionId}`.gray);
      if (!oldState.selfVideo && newState.selfVideo) return console.log(`${newState.member.user.tag} Is now ${newState.selfVideo ? "self Video Sharing" : "not self Video Sharing"}`.gray);
      if (oldState.selfVideo && !newState.selfVideo) return console.log(`${newState.member.user.tag} Is now ${newState.selfVideo ? "self Video Sharing" : "not self Video Sharing"}`.gray)
    };

    // JOINED A CHANNEL
    if (!oldState.channelId && newState.channelId) {
      databasing(newState.guild.id, client); //load every database
      let channels = [];
      channels.push(client.settings.get(newState.guild.id, `channel`));
      channels.push(client.settings2.get(newState.guild.id, `channel`));
      channels.push(client.settings3.get(newState.guild.id, `channel`));
      for (let i = 0; i < channels.length; i++) {
        if (channels[i].length > 2 && channels[i].includes(newState.channelId)) {
          create_join_to_create_Channel(client, newState, i + 1);
          break
        }
      };
      return
    };
    // LEFT A CHANNEL
    if (oldState.channelId && !newState.channelId) {
      databasing(oldState.guild.id, client); //load every database
      client.jointocreatemap.ensure(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`, false);
      if (client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`)) {
        //CHANNEL DELETE CHECK
        var vc = oldState.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));
        if (vc.members.size < 1) {
          console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"}`.strikethrough.brightRed);
          client.jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
          client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
          return vc.delete().catch(e => console.log("Couldn't delete room"))
        } else {
          let perms = vc.permissionsFor(newState.member.id);
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].allow.toArray().includes("MANAGE_CHANNELS") && perms[i].id == oldState.member.user.id) owner = true
          };
          //if owner left, then pick a random user
          if (owner) {
            let members = vc.members.map(member => member.id);
            let randommemberid = members[Math.floor(Math.random() * members.length)];
            vc.permissionOverwrites.create(randommemberid, {
              CONNECT: true,
              VIEW_CHANNEL: true,
              MANAGE_CHANNELS: true,
              MANAGE_ROLES: true
            }).catch(e => console.log(e.message));
            vc.permissionOverwrites.create(randommemberid, {
              CONNECT: true,
              VIEW_CHANNEL: true,
              MANAGE_CHANNELS: true,
              MANAGE_ROLES: true
            }).catch(e => console.log(e.message))
            try {
              client.users.fetch(randommemberid).then(user => {
                user.send({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle("The Owner left, you are now the new one!")
                    .setDescription(`you now have access to all \.help voice\` Commands!`)]
                })
              })
            } catch {
              /* */
            }
          }
        }
      }
    };

    // Switch A CHANNEL
    if (oldState.channelId && newState.channelId) {
      databasing(newState.guild.id, client);
      if (oldState.channelId !== newState.channelId) {
        let channels = [];
        channels.push(client.settings.get(newState.guild.id, `channel`));
        channels.push(client.settings2.get(newState.guild.id, `channel`));
        channels.push(client.settings3.get(newState.guild.id, `channel`));
        for (let i = 0; i < channels.length; i++) {
          if (channels[i].length > 2 && channels[i].includes(newState.channelId)) {
            create_join_to_create_Channel(client, newState, i + 1);
            break
          }
        };
        //ENSURE THE DB
        client.jointocreatemap.ensure(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`, false);
        //IF STATEMENT
        if (client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`)) {
          var vc = oldState.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`));
          if (vc.members.size < 1) {
            console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"}`.strikethrough.brightRed);
            client.jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelId}`);
            client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
            return vc.delete().catch(e => console.log("Couldn't delete room"))
          } else {
            /* */
          }
        }
      }
    }
  })
};

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
