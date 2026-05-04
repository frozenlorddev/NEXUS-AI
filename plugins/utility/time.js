module.exports = {
  command: ["time", "date", "clock"],
  desc: "Get current date and time",
  category: "Utility",
  usage: ".time [timezone]",
  run: async ({ args, xreply }) => {
    const tz = args.join(" ") || "Africa/Nairobi";
    try {
      const now = new Date();
      const options = {
        timeZone: tz,
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
      return xreply(`🕐 *Date & Time*\n\n📍 Timezone: ${tz}\n📅 ${formatted}`);
    } catch {
      return xreply("❌ Invalid timezone. Example: .time America/New_York");
    }
  }
};
