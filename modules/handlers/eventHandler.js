const fs = require('fs');
const path = require('path');
const colors = require('ansi-colors');

module.exports = (client, config) => {
    const eventsPath = path.join(__dirname, '..', 'events'); // Пълен път до директорията със събития
    let loadedEvents = 0; // Брояч на заредените събития

    for (let file of fs.readdirSync(eventsPath)) {
        const eventFilePath = path.join(eventsPath, file); // Пълен път до файла на събитието
        try {
            require(eventFilePath);
            loadedEvents++;
            console.log(`${colors.green('[INFO]')} Client Event loaded: ${colors.yellow(file)}`);
        } catch (error) {
            console.error(`${colors.red('Error loading client event:')} ${colors.yellow(file)}`);
            console.error(error);
        }
    }

    console.log(`${colors.cyan('Total')} ${loadedEvents} ${colors.cyan('client events loaded.')}`);
};
