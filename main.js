const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require('./config.json');
bot.login(process.env.token); // for heroku variable
//moin
bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

  if (!newMember.roles.some(x => x.name === config.targetRole)) { // supporters doesn't trigger the messages
    let supporters = getMembersFromRole(config.targetRole);
    if (newUserChannel !== undefined && newUserChannel.name === config.targetChannel) {  // user joins a channel
      sendMessageToMembers(supporters, `Hey! Der User **${newMember.displayName}** wartet im Support Channel auf dich! Schau vorbei :smile:`);
    } else if (newUserChannel === undefined && oldUserChannel.name === config.targetChannel) {  // user leaves a channel
      sendMessageToMembers(supporters, `Hey! Der User **${newMember.displayName}** hat den Support Channel verlassen :confused:`);
    }
  }

  function getMembersFromRole(role) {
    return bot.guilds.get(config.serverID).roles.find(x => x.name === role).members.map(m => m.user);
  }

  function sendMessageToMembers(members, message) {
    members.forEach(member => {
      bot.users.get(member.id).send(message);
      log(`Message sent to ${member.username}`);
    });
  }
  
});

bot.on('message', msg => {
  if (!msg.author.bot && msg.channel.type === 'dm') {
    log(`${msg.author.username} sent a private message: ${msg.content}`);
    msg.reply(`Hey! Solltest du Hilfe auf dem **${config.serverName}** Server benötigen, dann komm doch in den ${config.supportWaitingRoom} Channel! Ein Supporter wird sich schnellstmöglich um deine Anliegen kümmern :smile: Desweiteren kannst du auch gerne einen Supporter auf unseren Minecraft Server anschreiben :smile:`);
  }
});

function log(msg) {
  console.log("Support Bot: " + msg);
}
