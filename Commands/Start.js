const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Start First Goal game."),
    async execute(interaction) {
        
    }
};