const client = require('../../index');
const fs = require("fs");

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
        const interactionModuleCustomId = await client.interactions.get(interaction.customId);

        if (!interactionModuleCustomId) {
            return interaction.reply({
                content: '`❌` Invalid interaction, please try again later.',
                ephemeral: true,
            });
        }
        interactionModuleCustomId.run(client, interaction);
    } else return;
});