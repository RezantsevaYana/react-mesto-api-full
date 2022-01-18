const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const CastError = require("../errors/CastError");
const EmailError = require("../errors/EmailError");
const AuthError = require("../errors/AuthError");

// контроллер отвечающий за поиск вообще всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

// контроллер отвечающий за поиск пользователя по айди
module.exports.getUser = (req, res, next) => {
  User.findById({ id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователя с указанным id не существует");
      } else {
        res.status(200).send(user);
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

// контроллер проверки текущего пользователя
module.exports.getUserFind = (req, res, next) => {
  User.findById({ id: req.user._id })
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "CastError") {
        next(new CastError("Некорректные данные"));
      } else {
        next(e);
      }
    });
};

// контроллер отвечающий за создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(200).send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные при создании пользователя"));
      } else if (e.code === 11000) {
        next(new EmailError("Пользователь с таким email уже существует"));
      } else {
        next(e);
      }
    });
};

// контроллер отвечающий за обновление информации о пользователе
module.exports.updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findOneAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователя с указанным id не существует");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные при обновлении профиля"));
      } else {
        next(e);
      }
    });
};

// контроллер отвечающий за обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findOneAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователя с указанным id не существует");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные при обновлении аватара"));
      } else {
        next(e);
      }
    });
};

// контроллер аутентификации

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError("Неправильные почта или пароль");
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError("Неправильные почта или пароль");
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};
