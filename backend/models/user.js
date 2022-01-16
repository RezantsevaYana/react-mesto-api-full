const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");
const regexURL = require("../regex/regexURL");
// создаем схему пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь океана",
  },
  avatar: {
    type: String,
    required: true,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (v) => regexURL.test(v),
      message: "Неверный формат ссылки",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Неверный формат ссылки",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// создание модели пользователя
module.exports = mongoose.model("user", userSchema);
