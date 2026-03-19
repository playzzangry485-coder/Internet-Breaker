const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = ".";

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  const play = require('play-dl');
const ytSearch = require('yt-search');

if (command === 'play') {
  if (!message.member.voice.channel) {
    return message.reply('Join VC first!');
  }

  const query = args.join(" ");
  if (!query) return message.reply('Give song name or link');

  let url;

  if (play.yt_validate(query) === 'video') {
    url = query;
  } else {
    const search = await ytSearch(query);
    if (!search.videos.length) return message.reply('No results');

    url = search.videos[0].url;
  }

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator
  });

  const stream = await play.stream(url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });

  const player = createAudioPlayer();
  player.play(resource);

  connection.subscribe(player);

  message.reply(`Playing 🎶`);
    }
  
