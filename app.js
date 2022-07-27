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

// restaurant, museum, shopping mall, cafe
let type = "";

// when the bot is first started
bot.start((ctx) => {
  ctx.reply(
    "Hello! This is GGCoolSpotBot! I will try to help " +
      "you find all the cool spots within your current area!" +
      " What kind of cool spots would you like to find?" +
      " /restaurant /museum /cafe /shoppingmall"
  );
});

// just prompts the user to send their location
bot.help((ctx) => {
  ctx.reply(
    "Choose which kind of spots to look for! By pressing one of the commands /restaurant /museum /cafe /shoppingmall"
  );
});

bot.on("text", (ctx) => {
  type = ctx.message.text;
  if (type != "/shoppingmall") {
    ctx.reply("Okay! Looking for " + type.substring(1, type.length) + "s...");
    ctx.reply("Send me your live GPS location to get started!");
  } else {
    ctx.reply("Okay! Looking for shopping malls...");
    ctx.reply("Send me your live GPS location to get started!");
  }
});

// when the location is finally sent
bot.on("location", (ctx) => {
  long = ctx.message.location.longitude;
  lat = ctx.message.location.latitude;
  ctx.reply("Thanks for sending me ur location!");
  if (type == "") {
    ctx.reply(
      "Do select the type of spot you want to search! /restaurant /cafe /museum /shoppingmall"
    );
  } else {
    client
      .placesNearby({
        params: {
          location: { lat: lat, lng: long },
          key: "AIzaSyAvJ7fWhCOIrXwnQvmGyLAs3dzMdQNDo7g",
          radius: 500,
          opennow: true,
          rankby: PlacesNearbyRanking.prominence, // or prominence also is fine
          type:
            type != "/shoppingmall"
              ? type.substring(1, type.length)
              : "shopping_mall",
        },
        timeout: 1000, // milliseconds
      })

      .then((r) => {
        const resultArray = r.data.results;
        if (resultArray.length == 0) {
          ctx.reply("Sorry! None found.");
        }
        for (let i = 0; i < resultArray.length; i++) {
          ctx.reply(
            resultArray[i].name + "\n" + "Address: " + resultArray[i].vicinity
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

bot.use((ctx) => {
  ctx.reply(
    "Hi fellow human! Are you confused? Press the command /help if you are!"
  );
});

bot.launch();
