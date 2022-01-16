const mongoose = require("mongoose");
const { default: isURL } = require("validator/lib/isURL");

// схема карточки
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: "Неверный формат ссылки",
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.ObjectId,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создание модели карточки
module.exports = mongoose.model("card", cardSchema);
