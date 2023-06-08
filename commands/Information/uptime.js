const { EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
    command_data: {
        name: 'uptime',
        description: 'Check the client\'s uptime.',
        type: 1,
        options: [],
    },
    role_perms: null,
    developers_only: false,
    cooldown: '5s',
    category: 'Information',
    run: async (client, interaction) => {
        const date = new Date().getTime() - (client.uptime);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(`Started on: <t:${Math.floor(new Date(date).getTime() / 1000)}> (<t:${Math.floor(new Date(date).getTime() / 1000)}:R>)`)
                    .setColor('Green')
            ]
        });

    },
};