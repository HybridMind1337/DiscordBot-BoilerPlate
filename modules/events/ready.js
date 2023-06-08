const Discord = require('discord.js');
const fs = require('fs');
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync('./configs/config.yml', 'utf8'));
const colors = require('ansi-colors');
const client = require('../../index');
const packageFile = require('../../package.json');

client.once('ready', async () => {
    // Проверяваме дали бота е в Discord групата, ако не е да покажем да се покани.
    let guild = client.guilds.cache.get(config.serverID)
    if (!guild) {
        console.log('\x1b[31m%s\x1b[0m', `[ERROR] The guild ID specified in the config is invalid or the bot is not in the server!\nYou can use the link below to invite the bot to your server:\nhttps://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
        process.exit()
    }

    // bot activity
    let activType;
    if (config.BotActivitySettings.Type === "WATCHING") activType = Discord.ActivityType.Watching
    if (config.BotActivitySettings.Type === "PLAYING") activType = Discord.ActivityType.Playing
    if (config.BotActivitySettings.Type === "COMPETING") activType = Discord.ActivityType.Competing

    if (config.BotActivitySettings.Enabled) {
        let index = 0
        client.user.setActivity(config.BotActivitySettings.Statuses[0].replace(/{total-users}/g, `${guild.memberCount}`).replace(/{total-channels}/g, `${client.channels.cache.size}`).replace(/{total-messages}/g, activType), { type: activType });
        setInterval(() => {
            if (index === config.BotActivitySettings.Statuses.length) index = 0
            client.user.setActivity(config.BotActivitySettings.Statuses[index].replace(/{total-users}/g, `${guild.memberCount}`).replace(/{total-channels}/g, `${client.channels.cache.size}`).replace(/{total-messages}/g, activType), { type: activType });
            index++;
        }, config.BotActivitySettings.Interval * 1000);
    }

    // Проверяваме дали бота е в правилният сървър, ако не е напускаме
    client.guilds.cache.forEach(guild => {
        if(!config.serverID.includes(guild.id)) {
            guild.leave();
            console.log('\x1b[31m%s\x1b[0m', `[INFO] Someone tried to invite the bot to another server! I automatically left it (${guild.name})`)
        }
    })

    // Проверяваме правилата на бота.
    if (guild && !guild.members.me.permissions.has("Administrator")) {
        console.log('\x1b[31m%s\x1b[0m', `[ERROR] The bot doesn't have enough permissions! Please give the bot ADMINISTRATOR permissions in your server or it won't function properly!`)
    }

    await console.log("―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");
    await console.log("                                                                          ");
    await console.log(`• ${colors.green(colors.bold(`The bot v${packageFile.version} is now Online!`))}`);
    await console.log("                                                                          ");
    await console.log("――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――");

    let logMsg = `\n\n[${new Date().toLocaleString()}] [READY] Bot is now ready!`;
    fs.appendFile("./data/logs.txt", logMsg, (e) => {
        if (e) console.log(e);
    });
});
