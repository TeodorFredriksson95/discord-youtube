const fs = require('node:fs')
const path = require('node:path')
const wait = require('node:timers/promises').setTimeout;


// Require the nessescary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for( const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
}

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isButton()) return;

    console.log(interaction.user.id)
    console.log(interaction.customId)
    
    console.log('-'.repeat(50))

const filter = i => i.customId === 'primary' && i.user.id === '228579613159325696';
console.log(filter)

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5000 });

collector.on('collect', async i => {
	if (i.customId === 'primary') {S
		await i.deferUpdate();
		await wait(4000);
		await i.editReply({ content: 'A button was clicked!', components: [] });
	}
});

collector.on('end', collected => console.log(`Collected ${collected.size} items`));

});

// Log in to Discord with your client's token
client.login(token)