const axios = require("axios");

module.exports = {
  command: ["recipe", "food", "cook"],
  desc: "Get a recipe for a dish",
  category: "Search",
  usage: ".recipe <dish name>",
  run: async ({ args, trashcore, m, chat, xreply }) => {
    if (!args.length) return xreply("🍳 Usage: .recipe <dish>\nExample: .recipe pasta");
    const query = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
        { timeout: 10000 }
      );
      const meal = data?.meals?.[0];
      if (!meal) return xreply(`❌ No recipe found for "${query}".`);
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && ing.trim()) ingredients.push(`• ${meas?.trim() || ""} ${ing}`.trim());
      }
      const text =
        `🍳 *${meal.strMeal}*\n` +
        `🌍 Cuisine: ${meal.strArea}\n` +
        `🏷️ Category: ${meal.strCategory}\n\n` +
        `🛒 *Ingredients (${ingredients.length}):*\n${ingredients.join("\n")}\n\n` +
        `📖 *Instructions:*\n${meal.strInstructions?.slice(0, 600)}${meal.strInstructions?.length > 600 ? "..." : ""}\n\n` +
        `${meal.strYoutube ? "▶️ Video: " + meal.strYoutube : ""}`;
      if (meal.strMealThumb) {
        await trashcore.sendMessage(chat, { image: { url: meal.strMealThumb }, caption: text }, { quoted: m });
      } else {
        await xreply(text);
      }
    } catch {
      await xreply("❌ Failed to fetch recipe. Please try again.");
    }
  }
};
