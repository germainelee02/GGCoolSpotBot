// just some imported stuff
const {
  Client,
  PlacesNearbyRanking,
} = require("@googlemaps/google-maps-services-js");
const { Telegraf } = require("telegraf");
const bot = new Telegraf("5576426748:AAGLIoktXrDmKKjQtMx2A_WyemWI68K0cLM");
const client = new Client({});

let long = "";
let lat = "";

// when the bot is first started
bot.start((ctx) => {
  ctx.reply(
    "Hello! This is GGCoolSpotBot! I will try to help " +
      "you find all the cool spots within your current area!" +
      " Do press the command /help or send me your location to get started!"
  );
});

// just prompts the user to send their location
bot.help((ctx) => {
  ctx.reply("Send me your location to get started! >_<");
});

// when the location is finally sent
bot.on("location", (ctx) => {
  long = ctx.message.location.longitude;
  lat = ctx.message.location.latitude;
  ctx.reply("Thanks for sending me ur location!");
  client
    .placesNearby({
      params: {
        location: { lat: lat, lng: long },
        key: "AIzaSyAvJ7fWhCOIrXwnQvmGyLAs3dzMdQNDo7g",
        radius: 100000,
        opennow: true,
        rankby: PlacesNearbyRanking.prominence, // or prominence also is fine
      },
      timeout: 1000, // milliseconds
    })

    .then((r) => {
      console.log(r.data.results[1]);
      ctx.reply(r.data.results[1].name);
    })
    .catch((e) => {
      console.log(e);
    });
});

bot.use((ctx) => {
  ctx.reply(
    "Hi fellow human! Thank you for the chat. Do send your location to get started!"
  );
});

bot.launch();
