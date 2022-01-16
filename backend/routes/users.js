const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers, getUser, updateUser, updateAvatar, getUserFind,
} = require("../controllers/users");
const regexURL = require("../regex/regexURL");

// роут для проверки текущего пользователя
router.get("/users/me", getUserFind);

// роутер, который возвращает всех пользователей
router.get("/users", getUsers);

// возвращает пользователя по _id
router.get("/users/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);

// обновляет профиль
router.patch("/users/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

// обновляет аватар
router.patch("/users/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regexURL),
  }),
}), updateAvatar);

module.exports = router;
