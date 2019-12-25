const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require('./config.json');
let loggedInSupporters = [];

bot.login('NTM0MTE2NzEwOTYyNDI5OTgy.XgJmog.ZMmNB5LVkcQ-YqEtBpZGLAwwGtA'); // for heroku variable

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

  if (!newMember.roles.some(x => x.name === config.targetRole)) { // supporters doesn't trigger the messages
    // let supporters = getMembersFromRole(config.targetRole);
    if (newUserChannel !== undefined && newUserChannel.name === config.targetChannel) {  // user joins a channel
      sendMessageToMembers(loggedInSupporters, `Hey! Der User **${newMember.displayName}** wartet im Support Channel auf dich! Schau vorbei :smile:`);
    } else if (newUserChannel === undefined && oldUserChannel.name === config.targetChannel) {  // user leaves a channel
      sendMessageToMembers(loggedInSupporters, `Hey! Der User **${newMember.displayName}** hat den Support Channel verlassen :confused:`);
    }
  }  
});

bot.on('message', msg => {
  if (!msg.author.bot && msg.channel.type === 'dm') {
    if (msg.content === 'login' && authorHasRole(msg.author, config.targetRole)) {
      addLoggedInSupporter(msg.author, msg);
    } else if (msg.content === 'logout') {
      loggedInSupporters.pop(msg.author);
      log(`Supporter ${msg.author.username} logged out!`);
      msg.reply('You are now logged out!');
    } else {
      log(`${msg.author.username} sent a private message: ${msg.content}`);
      msg.reply(`Hey! Solltest du Hilfe auf dem **${config.serverName}** Server benötigen, dann komm doch in den ${config.supportWaitingRoom} Channel! Ein Supporter wird sich schnellstmöglich um deine Anliegen kümmern :smile: Desweiteren kannst du auch gerne einen Supporter auf unseren Minecraft Server anschreiben :smile:`);
    }
  }
});

function getMembersFromRole(role) {
  return bot.guilds.get(config.serverID).roles.find(x => x.name === role).members.map(m => m.user);
}

function sendMessageToMembers(members, message) {
  members.forEach(member => {
    bot.users.get(member.id).send(message);
    log(`Message sent to ${member.username}`);
  });
}

function addLoggedInSupporter(author, message) {
  if (!loggedInSupporters.some(supporter => supporter === author)) {
    loggedInSupporters.push(author);
    log(`Supporter ${author.username} logged in!`);
    message.reply(`You are now logged in! You will receive messages when a players joins or leaves the ${config.supportWaitingRoom}!`);
  } else {
    log(`Supporter ${author.username} tried to log in multiple times!`);
    message.reply('You are already logged in!');
  }
}

function log(msg) {
  console.log("Support Bot: " + msg);
}

function authorHasRole(author, role) {
  return getMembersFromRole(role).some(member => member.username === author.username);
}
