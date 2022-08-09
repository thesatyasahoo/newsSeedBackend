const mongoose = require("mongoose");

let News = mongoose.model("news", {
  isAdded: { type: Boolean },
  user: {type: String},
  author: {type: String},
  content: {type: String},
  publishedAt: {type: String},
  description: {type: String},
  title: {type: String},
  url: {type: String},
  urlToImage: {type: String},
  source: {
    id: {type: String},
    name: {type: String},
  },
});

module.exports = News;
