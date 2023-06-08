module.exports = {
    customId: 'hello_reply',
    run: async (client, interaction) => {

        return interaction.reply({
            content: 'Hello world!'
        });

    }
};