module.exports = (logLevel = "debug") => {
  require("log4js").configure({
    appenders: {
      log: {
        type: "stdout",
      },
    },
    categories: {
      default: {
        appenders: ["log"],
        level: logLevel,
      },
    }
  });
};
