const axios = require("axios");

const APIS = {
  cat:   "https://api.thecatapi.com/v1/images/search",
  dog:   "https://dog.ceo/api/breeds/image/random",
  fox:   "https://randomfox.ca/floof/",
  duck:  "https://random-d.uk/api/random",
  panda: "https://some-random-api.com/animal/panda",
  koala: "https://some-random-api.com/animal/koala",
  bird:  "https://some-random-api.com/animal/bird",
  kangaroo: "https://some-random-api.com/animal/kangaroo",
  raccoon:  "https://some-random-api.com/animal/raccoon",
  whale:    "https://some-random-api.com/animal/whale",
};

module.exports = {
  command: Object.keys(APIS),
  desc: "Get random animal images",
  category: "Fun",
  usage: ".cat | .dog | .fox | .duck | .panda | .koala | .bird | .kangaroo | .raccoon | .whale",
  run: async ({ command, trashcore, m, chat, xreply }) => {
    try {
      const url = APIS[command];
      const { data } = await axios.get(url, { timeout: 8000 });
      let imgUrl, fact = "";
      if (command === "cat")      imgUrl = data[0]?.url;
      else if (command === "dog") imgUrl = data.message;
      else if (command === "fox") imgUrl = data.image;
      else if (command === "duck") imgUrl = data.url;
      else { imgUrl = data.image; fact = data.fact ? `\n\n🧠 _${data.fact}_` : ""; }
      if (!imgUrl) throw new Error("No image");
      const emojis = { cat:"🐱",dog:"🐶",fox:"🦊",duck:"🦆",panda:"🐼",koala:"🐨",bird:"🐦",kangaroo:"🦘",raccoon:"🦝",whale:"🐳" };
      await trashcore.sendMessage(chat, {
        image: { url: imgUrl },
        caption: `${emojis[command] || "🐾"} *Random ${command.charAt(0).toUpperCase() + command.slice(1)}*${fact}`
      }, { quoted: m });
    } catch {
      await xreply(`❌ Failed to fetch ${command} image. Try again!`);
    }
  }
};
