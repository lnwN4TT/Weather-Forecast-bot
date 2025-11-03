import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import axios from 'axios';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "weather_schema",
  password: ""
});

connection.connect((err) => {
  if (err) {
    console.err("Error connecting to mySQL", err); //db
    return;
  }
  console.log("Connected to MySQL Successfully");
});

// connection.query('SELECT * from weather_schema.new_table', (err, res) => { //select
//   return console.log(res)
// })

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userName = interaction.user.username; //เก็บuser
  const displayName = interaction.member.displayName;
  const commandName = interaction.commandName;
  const atdate = new Date();
  const atTime = atdate.toTimeString();
  const timeSplit = atTime.split(" ")[0];

  // console.log(userName);
  // console.log(displayName);
  // console.log(commandName);
  // console.log(atdate);
  // console.log(atTime);

  if (interaction.commandName === 'weather') {
    const city = interaction.options.getString('city');

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.APIKEY}&units=metric&lang=th`);
      //console.log(response.data);
      const weather = response.data.weather[0].description;
      const temperature = response.data.main.temp;
      const feellike = response.data.main.feels_like;
      const windsp = response.data.wind.speed;
      const windgust = response.data.wind.gust;
      const winddeg = response.data.wind.deg;
      const lat = response.data.coord.lat;
      const lon = response.data.coord.lon;


      connection.query("INSERT INTO `new_table`(userName,display_Name,command,city,atDate,atTime,weather,temp,feellike,windsp,windgust,winddeg) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [userName, displayName, commandName, city.toUpperCase(), atdate, timeSplit, weather, temperature, feellike, windsp, windgust, winddeg], (err, res) => {
        if (err) {
          console.log("Error exicuting query", err); //db
          return;
        }
        return console.log(res);
      })

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Weather now')
        .setDescription('รายงานสภาพอากาศวันนี้')
        .setAuthor({ name: 'Weather Forecast', iconURL: 'https://lnwn4tt.github.io/Natdanai/WeatherBot.png', url: 'https://openweathermap.org/' })
        .setThumbnail('https://lnwn4tt.github.io/Natdanai/WeatherBot.png')
        .addFields(
          { name: 'เมือง:', value: `${city.toUpperCase()}` },
          { name: 'สภาพอากาศ:', value: `${weather}`, inline: true },
          { name: 'อุณหภูมิ:', value: `${temperature}°C`, inline: true },
          { name: 'รู้สึกเหมือน:', value: `${feellike}°C`, inline: true },
          { name: 'ความเร็วลม:', value: `${windsp} กม/ชม.`, inline: true },
          { name: 'ลมกระโชกแรง:', value: `${windgust} กม/ชม.`, inline: true },
          { name: 'ทิศทางลม:', value: `${winddeg}°`, inline: true }
        )
        .setImage('https://lnwn4tt.github.io/Natdanai/weatherGIF.gif')
        .setTimestamp()
        .setFooter({ text: 'Weather Forecast', iconURL: 'https://lnwn4tt.github.io/Natdanai/WeatherBot.png' });
        

      interaction.reply({ embeds: [embed] });
      //await interaction.reply(`สภาพอากาศวันนี้ \nเมือง: \"${city.toUpperCase()}\"\nสภาพอากาศ: ${weather}\nอุณหภูมิ: ${temperature}°C\tรู้สึกเหมือน: ${feellike}\nความเร็วลม: ${windsp} กม/ชม.\tลมกระโชกแรง: ${windgust}กม/ชม.\tทิศทางลม: ${winddeg}°`);

    } catch (error) {

      console.log(error);
      await interaction.reply('โปรดระบุชื่อเมืองเป็นภาษาอังกฤษ');
    }

  }

  if (interaction.commandName === 'forecast') {
    const cityforcast = interaction.options.getString('city');
    try {
      const responseForecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityforcast}&appid=${process.env.APIKEY}&units=metric&lang=th`);
      //console.log(responseForecast.data);
      //const lat = responseForecast.data.city.coord.lat;
      //const lon = responseForecast.data.city.coord.lon;
      const foreweather = responseForecast.data.list[2].weather[0].description;
      const temp = responseForecast.data.list[2].main.temp;
      const date = responseForecast.data.list[2].dt_txt;
      const forefeellike = responseForecast.data.list[2].main.feels_like;
      const forewindsp = responseForecast.data.list[2].wind.speed;
      const forewindgust = responseForecast.data.list[2].wind.gust;
      const forewinddeg = responseForecast.data.list[2].wind.deg;
      const dateSplit = date.split(" ")[0];
      const time = date.split(" ")[1];

      //const responseForecast3 = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${process.env.APIKEY}&units=metric&lang=th`);
      //console.log(responseForecast3.data);

      connection.query("INSERT INTO `new_table`(userName,display_Name,command,city,atDate,atTime,weather,temp,feellike,windsp,windgust,winddeg) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [userName, displayName, commandName, cityforcast.toUpperCase(), atdate, timeSplit, foreweather, temp, forefeellike, forewindsp, forewindgust, forewinddeg], (err, res) => {
        if (err) {
          console.log("Error exicuting query", err); //db
          return;
        }
        return console.log(res);
      })

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Today\'s weather forecast')
        .setDescription('รายงานการพยากรณ์อากาศ')
        .setAuthor({ name: 'Weather Forecast', iconURL: 'https://lnwn4tt.github.io/Natdanai/WeatherBot.png', url: 'https://openweathermap.org/' })
        .setThumbnail('https://lnwn4tt.github.io/Natdanai/WeatherBot.png')
        .addFields(
          { name: 'วันที่:', value: `${dateSplit}`, inline: true },
          { name: 'เวลา:', value: `${time}`, inline: true },
          { name: 'เมือง:', value: `${cityforcast.toUpperCase()}` },
          { name: 'สภาพอากาศ:', value: `${foreweather}`, inline: true },
          { name: 'อุณหภูมิ:', value: `${temp}°C`, inline: true },
          { name: 'รู้สึกเหมือน', value: `${forefeellike}`, inline: true},
          { name: 'ความเร็วลม', value: `${forewindsp}`, inline: true},
          { name: 'ลมกระโชกแรง', value: `${forewindgust}`, inline: true},
          { name: 'ทิศทางลม', value: `${forewinddeg}`, inline: true}

        )
        .setImage('https://lnwn4tt.github.io/Natdanai/weatherGIF.gif')
        .setTimestamp()
        .setFooter({ text: 'Weather Forecast', iconURL: 'https://lnwn4tt.github.io/Natdanai/WeatherBot.png' });

      interaction.reply({ embeds: [embed] });
      //await interaction.reply(`การพยากรณ์อากาศ \nวันที่: ${dateSplit} เวลา: ${time}  \nเมือง: ${cityforcast.toUpperCase()} \nสภาพอากาศ: ${foreweather} \nอุณหภูมิ: ${temp}°C`);
      console.log(responseForecast.data.list[2]);
    } catch (error) {
      console.log(error);
      await interaction.reply('โปรดระบุชื่อเมืองเป็นภาษาอังกฤษ');
    }


  }
});

client.login(process.env.TOKEN);
