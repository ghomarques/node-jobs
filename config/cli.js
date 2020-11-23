module.exports = ((config) => {
  try {
    return require("command-line-args")(config);
  } catch (error) {
    return {};
  }
})([
  {
    type: String,
    name: "job",
    alias: "j",
    multiple: true,
  },
  {
    type: Boolean,
    name: "once",
    alias: "o",
  },
  {
    type: Boolean,
    name: "watch",
    alias: "w",
  },
]);
