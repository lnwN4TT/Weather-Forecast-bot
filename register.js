import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [

  {
    name: 'weather',
    description: 'รายงานสภาพอากาศปัจจุบัน',
    options: [
      {
        name: 'city',
        description: 'ชื่อเมือง',
        type: 3, //3 = string 4=integer 5=boolean
        required: true,
      },
    ]
  },
  {
    name: 'forecast',
    description: 'พยากรณ์อากาศ',
    options: [
      {
        name: 'city',
        description: 'ชื่อเมือง',
        type: 3,
        required: true,
      },
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const clientID = process.env.ClientID;
const channelID = process.env.ChannelID;

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationGuildCommands(clientID, channelID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}   