require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
// const validator = require("validator");
const bodyparser = require("body-parser");
const { celebrate, Joi, errors } = require("celebrate");
const routerUser = require("./routes/users");
const routerCard = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const regexURL = require("./regex/regexURL");
const NotFoundError = require("./errors/NotFoundError");
// сбор логов
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//console.log(process.env.NODE_ENV);

// подключаем логгер запросов
app.use(requestLogger);

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты не требующие авторизации
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexURL),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты требующие авторизации
app.use(routerUser);
app.use(routerCard);

// обработка запросов на несуществующий роут
app.use((req, res, next) => {
  next(new NotFoundError("Указанный маршрут не найден"));
});

// подключаем логгер ошибок
app.use(errorLogger);

// мидлвэр для обработки ошибок
app.use(errors());

// добавим централизованный обработчик ошибок
app.use((e, req, res, next) => {
  const { statusCode = 500, message } = e;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? "На сервере произошла ошибка"
        : message,
    });
  next();
});

// подключение к бд

mongoose.connect("mongodb://localhost:27017/mestodb").catch((error) => console.log(error));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// CORS простые запросы
app.use(function(req, res, next) {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', "*");
  }

  next();
});

// предварительные запросы
// Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
app.use(function(req, res, next) {
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }
  return res.end();
});