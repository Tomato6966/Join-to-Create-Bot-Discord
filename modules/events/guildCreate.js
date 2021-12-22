//IMPORT FILE DATA
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const {
    databasing,
    escapeRegex,
    reset_DB
} = require("../../modules/functions");
//import the Discord Library
const Discord = require("discord.js");
// HERE THE EVENT STARTS
module.exports = (client, guild) => {
    if (!guild) return;
    //find a channel instance, inside of the guild, where the bot has the Permission, to send a message
    let channel = guild.channels.cache.find(channel =>
        channel.type == "GUILD_TEXT" &&
        channel.permissionsFor(guild.me).has("SEND_MESSAGES")
    );
    //if no channel found return
    if (!channel) return;
    //reset the database
    reset_DB(guild.id, client);
    //if he has the permissions to send embeds, send an embed
    if (channel.permissionsFor(guild.me).has("EMBED_LINKS")) {
        channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor(ee.color)
                    .setTitle("These are all **NECCESSARY** cmds!")
                    .setURL("https://youtu.be/zNE8insVgOA")
                    .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/zNE8insVgOA)`)
                    .addField(`\`${config.prefix}help\``, "Shows all available Commands!", true)
                    .addField(`\`${config.prefix}add\``, "> *[Invite](https://discord.com/api/oauth2/authorize?client_id=761247967859965982&permissions=8&scope=bot) the Bot!*", true)
                    .addField(`\`${config.prefix}support\``, "> *Sends you a Link for the [SUPPORT SERVER](https://discord.gg/wvCp7q88G3) of the Bot!*", true)
                    .addField(`\`${config.prefix}ping\``, "> *Shows the ping of the Bot!*", true)
                    .addField(`\`${config.prefix}uptime\``, "> *Shows the uptime of the Bot!*", true)
                    .addField(`\`${config.prefix}info\``, "> *Shows Information & Stats of the Bot*", true)
                    .addField(`\`${config.prefix}tutorial\``, "> *Gives you a Link to the [Tutorial Video](https://youtu.be/zNE8insVgOA)*", true)
                    .addField(`\`${config.prefix}source\``, "> *Gives you a Link to the [Source Code on Github](https://youtu.be/zNE8insVgOA)*", true)
                    .addField("\u200b", "\u200b")
                    .addField(`\`${config.prefix}setup\` --> Follow steps`, "> *Set ups the Application System, maximum of 24 Questions!*")
                    .addField(`\`${config.prefix}editsetup <"acceptmsg"/"denymsg"/"question"/"role"/"addquestion"> [PARAMETER]\``, "> *Allows you to adjust the accept / deny msgs, or edit each Question. \n If needed you can add another Question / change the ROLE!*")
                    .addField("\u200b", "\u200b")
                    .addField(`\`${config.prefix}setup2\``, "> *Same as Setup 1 just your second Application System!*")
                    .addField(`\`${config.prefix}editsetup2\``, "> *Same as Setup 1(0) just your second Application System!*")
                    .addField(`\`${config.prefix}setup3\``, "> *Same as Setup 1(0) just your third Application System!*")
                    .addField(`\`${config.prefix}editsetup3\``, "> *Same as Setup 1(0) just your third Application System!*")
                    .addField("\u200b", "\u200b")
                    .addField("To get a list of all commands", `\`${config.prefix}help\``)
                    .setFooter(ee.footertext, ee.footericon)

            ]
        })
        channel.send({
            embeds: [new Discord.MessageEmbed()
                .setColor(ee.color)
                .setTitle("Thanks for Inviting me!")
                .setDescription(`To get started, simply type: \`${config.prefix}setup\` and follow the steps!`)
                .setFooter(ee.footertext, ee.footericon)]
        })
        channel.send("**Here is a TUTORIAL VIDEO:**\nhttps://youtu.be/zNE8insVgOA")
    } else {
        channel.send(`**Thanks for Inviting me!**\n\nTo get started, simply type: \`${config.prefix}setup\` and follow the steps\nType: \`${config.prefix}help\` to see a List of all Commands!`);
        channel.send("**Here is a TUTORIAL VIDEO:**\nhttps://youtu.be/zNE8insVgOA")
    }
};