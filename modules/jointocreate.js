const {
  MessageEmbed,
  Collection
} = require("discord.js")
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
module.exports = function(client) {
  //create a variable for the map
  console.log(` :: ⬜️ Module: jointocreate`)

  client.on("ready", () => {
    check_voice_channels(client);
    setInterval(() => check_voice_channels(client), config.check_all_channels_Interval_in_seconds * 1000)
  })

  //voice state update event to check joining/leaving channels
  client.on("voiceStateUpdate", (oldState, newState) => {
    //LOGS FOR EVERYTHING EXCEPT JOINING / LEAVING / SWITCHING
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
    if (oldState.sessionID != newState.sessionID) console.log(`${newState.member.user.tag} sessionID Is now on: ${newState.sessionID}`.gray);
    if (!oldState.selfVideo && newState.selfVideo) return console.log(`${newState.member.user.tag} Is now ${newState.selfVideo ? "self Video Sharing" : "not self Video Sharing"}`.gray);
    if (oldState.selfVideo && !newState.selfVideo) return console.log(`${newState.member.user.tag} Is now ${newState.selfVideo ? "self Video Sharing" : "not self Video Sharing"}`.gray);

    // JOINED A CHANNEL
    if (!oldState.channelID && newState.channelID) {
      databasing(newState.guild.id, client); //load every database
      let channels = [];
      channels.push(client.settings.get(newState.guild.id, `channel`))
      channels.push(client.settings2.get(newState.guild.id, `channel`))
      channels.push(client.settings3.get(newState.guild.id, `channel`))
      for (let i = 0; i < channels.length; i++) {
        if (channels[i].length > 2 && channels[i] === newState.channelID) {
          jointocreatechannel(newState, i + 1);
          break;
        }
      }
      return;
    }
    // LEFT A CHANNEL
    if (oldState.channelID && !newState.channelID) {
      databasing(oldState.guild.id, client); //load every database
      client.jointocreatemap.ensure(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`, false)
      if (client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {
        //CHANNEL DELETE CHECK
        var vc = oldState.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));
        if (vc.members.size < 1) {
          console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"}`.strikethrough.brightRed)
          client.jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`);
          return vc.delete().catch(e => console.log("Couldn't delete room"));
        } else {
          let perms = vc.permissionOverwrites.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].allow.toArray().includes("MANAGE_CHANNELS") && perms[i].id == oldState.member.user.id) owner = true;
          }
          //if owner left, then pick a random user
          if (owner) {
            let members = vc.members.map(member => member.id);
            let randommemberid = members[Math.floor(Math.random() * members.length)];
            vc.updateOverwrite(randommemberid, {
              CONNECT: true,
              VIEW_CHANNEL: true,
              MANAGE_CHANNELS: true,
              MANAGE_ROLES: true
            }).catch(e => console.log(e.message))
            vc.updateOverwrite(randommemberid, {
              CONNECT: true,
              VIEW_CHANNEL: true,
              MANAGE_CHANNELS: true,
              MANAGE_ROLES: true
            }).catch(e => console.log(e.message))
            try {
              client.users.fetch(randommemberid).then(user => {
                user.send(new MessageEmbed()
                  .setColor(ee.color)
                  .setFooter(ee.footertext, ee.footericon)
                  .setTitle("The Owner left, you are now the new one!")
                  .setDescription(`you now have access to all \`.help voice\` Commands!`))
              })
            } catch {
              /* */
            }
          }
        }
      }
    }

    // Switch A CHANNEL
    if (oldState.channelID && newState.channelID) {
      databasing(newState.guild.id, client);
      if (oldState.channelID !== newState.channelID) {
        let channels = [];
        channels.push(client.settings.get(newState.guild.id, `channel`))
        channels.push(client.settings2.get(newState.guild.id, `channel`))
        channels.push(client.settings3.get(newState.guild.id, `channel`))
        for (let i = 0; i < channels.length; i++) {
          if (channels[i].length > 2 && channels[i] === newState.channelID) {
            jointocreatechannel(newState, i + 1);
            break;
          }
        }
        //ENSURE THE DB
        client.jointocreatemap.ensure(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`, false)
        //IF STATEMENT
        if (client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {
          var vc = oldState.guild.channels.cache.get(client.jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));
          if (vc.members.size < 1) {
            console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"}`.strikethrough.brightRed)
            client.jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`);
            return vc.delete().catch(e => console.log("Couldn't delete room"));
          } else {
            /* */
          }
        }
      }
    }
  })

  function jointocreatechannel(user, type) {
    if (type == 1) chname = client.settings.get(user.member.guild.id, "channelname")
    else if (type == 2) chname = client.settings2.get(user.member.guild.id, "channelname")
    else if (type == 3) chname = client.settings3.get(user.member.guild.id, "channelname")
    else chname = "{user}'s Room"
    //CREATE THE CHANNEL
    let allowed = true;
    if (!user.guild.me.hasPermission("MANAGE_CHANNELS")) {
      allowed = false;
      try {
        user.member.user.send("${user.member.user} | :x: Error | Please give me the permission, `MANGE CHANNELS` --> I need to be able to create Channels ...")
      } catch {
        try {
          let channel = guild.channels.cache.find(
            channel =>
            channel.type === "text" &&
            channel.permissionsFor(guild.me).has("SEND_MESSAGES")
          );
          channel.send(`${user.member.user} | :x: Error | Please give me the permission, \`MANGE CHANNELS\` --> I need to be able to create Channels ...`)
        } catch {}
      }
    }
    if (allowed) {
      console.log(`Created the Channel: ${String(chname.replace("{user}", user.member.user.username)).substr(0, 32)} in: ${user.guild ? user.guild.name : "undefined"}`.brightGreen)
      user.guild.channels.create(String(chname.replace("{user}", user.member.user.username)).substr(0, 32), {
        type: 'voice',
        permissionOverwrites: [ //update the permissions
          {
            id: user.id, //the user is allowed to change everything
            allow: ['MANAGE_CHANNELS', "VIEW_CHANNEL", "MANAGE_ROLES", "CONNECT"],
          },
          { //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
            id: user.guild.id,
            allow: ['VIEW_CHANNEL', "CONNECT"],
          },
        ],
      }).then(vc => {
        if (user.channel.parent) vc.setParent(user.channel.parent)
        client.jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
        user.setChannel(vc);
      })
    }
  }

  function check_voice_channels(client) {
    let guilds = client.guilds.cache.map(guild => guild.id);
    for (let i = 0; i < guilds.length; i++) {
      try {
        let guild = client.guilds.cache.get(guilds[i]);
        databasing(guild.id, client)
        let jointocreate = []; //get the data from the database onto one variables
        jointocreate.push(client.settings.get(guild.id, "channel"))
        jointocreate.push(client.settings2.get(guild.id, "channel"))
        jointocreate.push(client.settings3.get(guild.id, "channel"))
        for (let j = 0; j < jointocreate.length; j++) {
          let channel = guild.channels.cache.get(jointocreate[j]);
          if (!channel) continue;
          let members = channel.members.map(guild => guild.id);
          if (!members) continue;
          for (let k = 0; k < members.length; k++) {
            let member = guild.members.cache.get(members[k]);
            jointocreatechannel(member.voice, j + 1);
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    return;
  }

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
}

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
