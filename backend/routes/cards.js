const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCard, createCard, cardDelete, likeCard, dislikeCard,
} = require("../controllers/cards");
const regexURL = require("../regex/regexURL");

// возвращает все карточки
router.get("/cards", getCard);

// создаёт карточку
router.post("/cards", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexURL),
  }),
}), createCard);

// удаляет карточку по идентификатору
router.delete("/cards/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), cardDelete);

// поставить лайк карточке
router.put("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);

// убрать лайк с карточки
router.delete("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

module.exports = router;
