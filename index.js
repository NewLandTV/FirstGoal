// Require
const { ActionRowBuilder, ButtonBuilder, Client, Collection, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Global variables
let playing = false;

// Regist all commands
client.commands = new Collection();

const commandFiles = fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);

    client.commands.set(command.data.name, command);
}

// Functions
async function Start(interaction) {
    // Controller embed
    const embed = new EmbedBuilder()
        .setColor(0x20880f)
        .setTitle("First Goal!");

    // Controls (End Button)
    const rowButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("End!")
                .setStyle("Secondary")
                .setCustomId("End")
    );

    interaction.channel.bulkDelete(1);

    await interaction.channel.send({ embeds: [embed], components: [rowButtons] });
}

// Client events
client.once("ready", () => {
    client.user.setActivity("First Goal!!!", { type: "PLAYING" });

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async interaction => {
    // Button events
    if (playing && interaction.isButton() && interaction.customId === "End") {
        playing = false;
        
        const embed = new EmbedBuilder()
            .setColor(0x20880f)
            .setTitle(`The winner is ${interaction.member.user.username}.`);

        await interaction.channel.send({ embeds: [embed] });

        return;
    }

    // Command processing
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        // Slash command execute
        playing = true;

        await command.execute(interaction);

        await Start(interaction);
    } catch (error) {
        console.error(error);

        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        });
    }
});

client.login(token);