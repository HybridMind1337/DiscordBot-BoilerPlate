const fs = require('fs');
const path = require('path');
const { Discord, Collection, Client, GatewayIntentBits, Partials } = require('discord.js');
const yaml = require('js-yaml');
const colors = require('ansi-colors');

const packageFile = require('./package.json');
const config = yaml.load(fs.readFileSync('./configs/config.yml', 'utf8'));
const handlersPath = path.join(__dirname, 'modules', 'handlers'); // Пълен път до директорията с хендлъри

// Установяване на Node.js версия
const version = Number(process.version.split('.')[0].replace('v', ''));
if (version < 16) {
    console.log(colors.red('[ERROR] The Bot requires a NodeJS version of 16.9 or higher!'));

    const logMsg = `\n\n[${new Date().toLocaleString()}] [ERROR] Plex Bot requires a NodeJS version of 16.9 or higher!`;
    fs.appendFile('./data/logs.txt', logMsg, (e) => {
        if (e) console.log(e);
    });
    process.exit();
}

// Инсталиране на зависимости, ако се изпълнява на Linux/MacOS
if (process.platform !== 'win32') {
    require('child_process').exec('npm install');
}

// Извеждане на съобщение за стартиране на бота
console.log(colors.yellow('Starting bot, this can take a while..'));

// Добавяне на информация в лог файл
const logMsg = `\n\n[${new Date().toLocaleString()}] [STARTING] Attempting to start the bot..\nNodeJS Version: ${process.version}\nBot Version: ${packageFile.version}`;
fs.appendFile('./data/logs.txt', logMsg, (e) => {
    if (e) console.log(e);
});

// Създаване на клиент на Discord
const client = new Client({
    restRequestTimeout: 60000,
    partials: [Partials.Reaction],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildBans,
    ]
});

module.exports = client;

// Зареждане на хендлърите
fs.readdirSync(handlersPath).forEach((handler) => {
    try {
        const handlerPath = path.join(handlersPath, handler);
        console.log(`${colors.green('[INFO]')} Handler loaded: ${colors.yellow(handler)}`);
        require(handlerPath)(client, config);
    } catch (error) {
        console.error(`${colors.red('[ERROR]')} Error loading handler: ${colors.yellow(handler)}`);
        console.error(error);
    }
});


// Логване в клиента
client.login(config.botToken);

// Обработка на грешки
function logError(errorType, error) {
    console.log(error);
    console.log(colors.red(`[v${packageFile.version}] If you need any support, please create a ticket in our discord server and provide the logs.txt file\n\n`));

    const errorMsg = `\n\n[${new Date().toLocaleString()}] [${errorType}] [v${packageFile.version}]\n${error.stack}`;
    fs.appendFile('./data/logs.txt', errorMsg, (e) => {
        if (e) console.log(e);
    });
}

client.on('warn', async (error) => {
    logError('WARN', error);
});

client.on('error', async (error) => {
    logError('ERROR', error);
});

process.on('unhandledRejection', async (error) => {
    logError('unhandledRejection', error);
});

process.on('uncaughtException', async (error) => {
    logError('uncaughtException', error);
});
