import { bot } from "./tokenkey";

const {
  Client,
  PlacesNearbyRanking,
} = require("@googlemaps/google-maps-services-js");
const { Telegraf, Markup } = require("telegraf");
const client = new Client({});

let long = "";
let lat = "";

// restaurant, museum, shopping mall, cafe
let type = "";

// when the bot is first started
bot.start((ctx) => {
  ctx.reply(
    "Hello! This is GGCoolSpotBot! I will try to help " +
      "you find all the cool spots within your current area!"
  );
  ctx.reply(
    "What kind of spots would you like to find?",
    Markup.keyboard(["restaurant", "cafe", "museum", "shoppingmall"])
      .oneTime()
      .resize()
  );
});

bot.help((ctx) => {
  ctx.reply(
    "Do choose what kind of spots to look for!",
    Markup.keyboard(["restaurant", "cafe", "museum", "shoppingmall"])
      .oneTime()
      .resize()
  );
});

// takes in what kind of spot to find, prompts to share location
bot.on("text", (ctx) => {
  let str = ctx.message.text;
  type = str;
  ctx.reply(
    "Can I get your location to get started?",
    Markup.keyboard([Markup.button.locationRequest("Sure! Get my location!")])
      .oneTime()
      .resize()
  );
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
        radius: 500,
        opennow: true,
        rankby: PlacesNearbyRanking.prominence,
        type: type != "shoppingmall" ? type : "shopping_mall",
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
});

bot.launch();

// graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
