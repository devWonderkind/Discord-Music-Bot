# Discord Music Bot
A feature-rich Discord Music Bot designed to enhance the audio experience on Discord servers by streaming high-quality music from YouTube.

## Features
- Play Music: Use !play <song name or URL> to stream music from YouTube.
- Queue Management: Automatically queues requested songs and handles playback order.
- Skip Songs: Use !skip to skip the current track.
- Stop Playback: Use !stop to stop music and clear the queue.

## Technology Used
- Node.js
- discord.js
- @discordjs/voice
- ytdl-core

## Installation

1. Clone the repository
 ```
 git clone <repository-url>
 cd <repository-folder>
 ```

2. Install dependencies
 ```
 npm install
 ```

3. Create a .env file to store your bot token:
 ```
 DISCORD_BOT_TOKEN=your-bot-token
 ```

4. Run the bot:
 ```
 node index.js
 ```
## Usage

 1. Invite the bot to your Discord server
 2. Use the following commands to control the music playback:
   - !play <song name or URL>: Plays the specified song or adds it to the queue.
   - !skip: Skips the currently playing song.
   - !stop: Stops all music and clears the queue.

## Example Commands 
 - !play Never Gonna Give You Up
 - !play https://www.youtube.com/watch?v=dQw4w9WgXcQ
 - !skip
 - !stop

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or new features to suggest.

## Acknowledgements
- [Discord.js](https://discord.js.org/#/)
- [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)
- [ytdl-core](https://github.com/fent/node-ytdl-core)
- [yt-search](https://www.npmjs.com/package/yt-search)