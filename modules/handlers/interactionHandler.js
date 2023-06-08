const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const colors = require('ansi-colors');

module.exports = (client) => {
    let interactionsCount = 0;

    const interactionsPath = path.join(__dirname, '../interactions');

    client.interactions = new Collection();

    for (let file of fs.readdirSync(interactionsPath)) {
        let module = require(path.join(interactionsPath, file));

        if (module.customId && typeof module.customId === 'string') {
            if (typeof client.interactions.set === 'function') {
                client.interactions.set(module.customId, module);
                interactionsCount++;

                console.log(`${colors.green('[INFO]')} Interaction loaded: ${colors.yellow(file)}`);
            } else {
                console.log(colors.yellow('[WARN] \'client.interactions\' is not defined or does not have a \'set\' method.'));
            }
        } else {
            console.log(colors.yellow('[WARN] Received empty property \'customId\' or invalid type (String) in ' + file + '.'));
        }
    }


    console.log(`${colors.cyan('Total')} ${interactionsCount} ${colors.cyan('interactions loaded')}`);
};
