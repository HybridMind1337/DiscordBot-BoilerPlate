# DiscordBot Boilerplate

Discord bot boilerplate built with discord.js v14

## Features

- Role permissions
- Developers only perms
- Owner only perms
- Cooldown
- Logging system
- Event Handler
- Application Command Handler
- Interactions Handler
- Bot Activity
    - You can change it from `configs/config.yml`
- Checking if the bot has the right permissions
- Checks if the bot is in the correct discord server, otherwise it will leave from others

## Installation

1. Clone this repository to your local machine.
2. Install the necessary dependencies by running the following command:
```shell
   npm install
```
3. Start the bot with the following command:
```shell
  node .
```

## Configuration
1. Open the `configs/config.yml` file.
2. Modify the following lines according to your desired configuration:
```yml
botID: '' # Bot ID
botToken:  # Bot TOKEN
serverID: '' # Guild ID
ownerID: '' # Youre ID
developers: # Developers user ID list
  - ''
log_channel: '' # Log channel

# ===========================================================================
# BOT ACTIVITY
# ===========================================================================
BotActivitySettings:
  Enabled: true
  Type: "WATCHING" # WATCHING, PLAYING, COMPETING
  Interval: 30 # Time in seconds between status changes, It's recommended to keep it above 20-30 seconds to avoid getting ratelimited
  Statuses: # Valid Variables: {total-users}, {total-channels}, {total-messages}
    - "{total-users} users"
    - "{total-messages} messages"
```

## License
[MIT], © 2023 HybridMind
