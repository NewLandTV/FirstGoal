// Require
const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId, guildId, token } = require("./config.json");
const fs = require("fs");

const commands = []
const commandFilter = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFilter) {
	const command = require(`./commands/${file}`);

	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

// Bot test server only slash command deploy.
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

console.log(commands);