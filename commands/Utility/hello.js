const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    command_data: {
        name: 'hello',
        description: 'Replies with hello world!',
        type: 1,
        options: [],
    },
    role_perms: null,
    developers_only: false,
    cooldown: '5s',
    category: 'Utility',
    run: async (client, interaction) => { // Even the 'client' parameter is not used, it must be provided.

        return interaction.reply({
            content: 'Click the button below!',
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('hello_reply')
                            .setLabel('Click me!')
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        });

    }
};