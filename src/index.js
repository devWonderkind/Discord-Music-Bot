
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const queue = new Map();

client.once('ready', () => {
  console.log('Ready!');
});
client.on('messageCreate', async message => {
    if (message.content === '!join') {
        // Check if the author is in a voice channel
        if (message.member.voice.channel) {
            // Join the voice channel
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                message.channel.send('Joined the voice channel!');
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                message.channel.send('Disconnected from the voice channel.');
            });
        } else {
            message.channel.send('You need to join a voice channel first!');
        }
    }
});


client.on('messageCreate', async message => {
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith('!play')) {
    await execute(message, serverQueue);
  } else if (message.content.startsWith('!skip')) {
    skip(message, serverQueue);
  } else if (message.content.startsWith('!stop')) {
    stop(message, serverQueue);
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(' ');
  const query = args.slice(1).join(' ');
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send('You need to be in a voice channel to play music!');
  }

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!');
  }

  const video = (await yts(query)).videos[0];
  if (!video) {
    return message.channel.send('No results found!');
  }

  const song = {
    title: video.title,
    url: video.url,
  };

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send('You have to be in a voice channel to stop the music!');
  }
  if (!serverQueue) {
    return message.channel.send('There is no song that I could skip!');
  }
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send('You have to be in a voice channel to stop the music!');
  }
  if (!serverQueue) {
    return message.channel.send('There is no song that I could stop!');
  }
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const player = createAudioPlayer();
  const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly' }));

  player.play(resource);
  serverQueue.connection.subscribe(player);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log('The bot is playing!');
  });

  player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  });

  player.on('error', error => {
    console.error('Error:', error.message);
  });

  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login('MTI2NDEwNzI5MTMyNjU0NjA2Mg.GRe-5v.S0RhmTc9sbpiz2v-QokCO0xIW-osDAgujFstH0');
