const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlachCommandBuilder#toJson() output of each commands data deployment
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}


// Construct and preprare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands ni the guild with the current set
        const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
        )
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error)
    }
})();


// // for guild-based commands
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1042771086623911988'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);

// // for global commands
// rest.delete(Routes.applicationCommand(clientId, '1042757545762234380'))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);