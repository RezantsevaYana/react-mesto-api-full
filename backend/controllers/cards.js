const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const CastError = require("../errors/CastError");
const DeleteError = require("../errors/DeleteError");

// контроллер отвечающий за отображение всех карточек на странице
module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

// контроллер отвечающий за создание новой карточки
module.exports.createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(200).send(card))
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные при создании карточки"));
      } else {
        next(e);
      }
    });
};

// контроллер отвечающий за удаление карточки
module.exports.cardDelete = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError("Карточка с указанным id не найдена"))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new DeleteError("Запрещено удалять карточки других пользователей");
      } else {
        return card.remove().then(() => res.status(200).send({ message: "Карточка удалена" }));
      }
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new CastError("Некорректный id"));
      } else {
        next(e);
      }
    });
};

// контроллер отвечающий за постановку лайка карточку
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с указанным id не найдена");
      } else {
        res.status(200).send(card);
      }
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new CastError("Некорректный id"));
      } else {
        next(e);
      }
    });
};

// контроллер отвечающий за удаление карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с указанным id не найдена");
      } else {
        res.status(200).send(card);
      }
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new CastError("Некорректный id"));
      } else {
        next(e);
      }
    });
};
