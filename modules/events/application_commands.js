const client = require('../../index');
const fs = require('fs');
const { REST } = require('discord.js');
const yaml = require('js-yaml');
const ms = require('ms');
const { EmbedBuilder } = require('discord.js');
const map_cooldown = new Map();
const colors = require('ansi-colors'); 

const config = yaml.load(fs.readFileSync('./configs/config.yml', 'utf8'));

client.on('interactionCreate', async (interaction) => {
    if (
        interaction.isChatInputCommand() ||
        interaction.isUserContextMenuCommand() ||
        interaction.isMessageContextMenuCommand()
    ) {
        const command = await client.commands.get(interaction.commandName);

        if (!command)
            return interaction.reply({
                content: colors.red('`❌` Invalid command, please try again later.'),
                ephemeral: true,
            });

        try {
            if (command.owner_only && typeof command.owner_only === 'boolean') {
                if (config.ownerID !== interaction.user.id) {
                    return interaction.reply({
                        content: '`❌` Sorry but this command is restricted for the bot owner only!',
                        ephemeral: true,
                    });
                }
            }

            if (command.developers_only === true && Array.isArray(config.developers) && config.developers.length > 0) {
                if (!config.developers.includes(interaction.user.id)) {
                    try {
                        await interaction.reply({
                            content: '`❌` Sorry but this command is restricted for developers only!', 
                            ephemeral: true,
                        });
                    } catch (error) {
                        console.error(colors.red(`Failed to send interaction reply: ${error}`)); // Използване на colors.red()
                    }
                    return;
                }
            }

            if (command.role_perms) {
                let boolean = false;

                if (Array.isArray(command.role_perms)) {
                    if (command.role_perms.length > 0) {
                        if (command.role_perms.some((r) => interaction.member.roles.cache.has(r))) {
                            boolean = true;
                        }
                    }
                } else if (typeof command.role_perms === 'string') {
                    const role = interaction.guild.roles.cache.get(command.role_perms);

                    if (role && interaction.member.roles.cache.has(role.id)) {
                        boolean = true;
                    }
                }

                if (!boolean) {
                    try {
                        await interaction.reply({
                            content: '`❌` Sorry but you are not allowed to use this command!', 
                            ephemeral: true,
                        });
                    } catch (error) {
                        console.error(colors.red(`Failed to send interaction reply: ${error}`)); 
                    }
                    return;
                }
            }

            if (command.cooldown && typeof command.cooldown === 'string') {
                const milliseconds = ms(command.cooldown);

                if (map_cooldown.has(interaction.user.id)) {
                    const date_now = new Date().getTime();

                    const data = map_cooldown.get(interaction.user.id);

                    if (data.sent_on < date_now) {
                        const time = new Date(date_now + milliseconds).getTime();

                        return interaction.reply({
                            content: `\`❌\` You are on cooldown! You can use this command again in <t:${Math.floor(
                                time / 1000
                            )}:f>.`, // Използване на colors.red()
                            ephemeral: true,
                        });
                    }
                } else {
                    const date_now = new Date().getTime();

                    map_cooldown.set(interaction.user.id, {
                        sent_on: date_now,
                    });

                    setTimeout(async () => {
                        map_cooldown.delete(interaction.user.id);
                    }, milliseconds);
                }
            }

            command.run(client, interaction, config);

            if (command.logger && typeof command.logger === 'boolean') {
                if (!config.log_channel) return;

                const channel = client.channels.cache.get(config.log_channel);

                if (!channel) return;

                channel
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Application command used: ' + interaction.commandName)
                                .setAuthor({
                                    name: client.user.username,
                                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                                })
                                .setFields(
                                    {
                                        name: 'User',
                                        value: `${interaction.member} (\`${interaction.user.id}\`)`,
                                    },
                                    {
                                        name: 'Used on',
                                        value: `<t:${Math.floor(interaction.createdTimestamp / 1000)}> (<t:${Math.floor(
                                            interaction.createdTimestamp / 1000
                                        )}:R>)`,
                                    }
                                )
                                .setColor('Blue'),
                        ],
                    })
                    .catch((error) => {
                        console.error(colors.red(`Failed to send log message to channel '${config.log_channel}': ${error}`)); // Използване на colors.red()
                    });
            }
        } catch (err) {
            console.warn(colors.yellow(`[WARN] Failed to run the command '${interaction.commandName}'.`));
            console.log(err);
        } finally {
            console.log(colors.green(`[INFO] ${interaction.user.username} has used the command '${interaction.commandName}'.`)); // Използване на colors.green()
        }
    } else return;
});
