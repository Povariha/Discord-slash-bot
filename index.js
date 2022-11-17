const dotenv = require('dotenv');
const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"] })
const fetch = require('node-fetch')
const { dir } = require('console')
const path = require('node:path')
dotenv.config();

client.login(process.env.token)

client.commands = new Discord.Collection();

client.once(Discord.Events.ClientReady, c => {
	console.log(`${c.user.tag} logged in. Ready to work!`);
});

fs.readdirSync("./commands/").forEach(dir => fs.readdirSync(`./commands/${dir}`)
    .forEach(file => {

    let jsfile = require(`./commands/${dir}/${file}`)
    console.log(`${file} `)
        let command = require(`./commands/${dir}/${file}`)
        client.commands.set(command.data.name, command)
        
    }))

client.on(Discord.Events.InteractionCreate, interaction => {
	console.log(interaction)
});

client.on(Discord.Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction)
})

client.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});