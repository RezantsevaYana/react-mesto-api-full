import React from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import { api } from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import DeleteCard from "./DeleteCard.js";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoTooLtip from "./InfoTooltip.js";
import ProtectedRoute from "./ProtectedRoute.js";
import * as auth from "../utils/auth.js";
// изображение для предупреждения об ошибке
import notRegister from "../images/negativ-result.svg";
import register from "../images/positiv_result.svg";

function App() {
  // переменные состояния для открытия попапов

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isDeleteCard, setIsDeleteCard] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState({});

  const [isInfoTooLtip, setIsInfoTooLtip] = React.useState(false);

  // переменная состояния отвечающая за удаление карточки

  const [deleteCard, setDeleteCard] = React.useState({});

  // стейт отвечающий за данные текущего пользователя

  const [currentUser, setCurrentUser] = React.useState({});

  // переменные состояния для карточек

  const [cards, setCards] = React.useState([]);

  // переменная состояния для идентификатора загрузки

  const [isLoading, setIsLoading] = React.useState(false);

  // переменная состояния для проверки авторизации пользователя

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const navigate = useNavigate();

  // переменные состояния для попапов результата регистрации

  const [image, setImage] = React.useState("");
  const [title, setTitle] = React.useState("");

  // переменные состояния, отвечающие за отображение маил в хэдэр

  const [email, setMail] = React.useState("");

  // загрузка первоначальной коллекции карточек и информации о пользователе
  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([profile, cards]) => {
        setCurrentUser(profile);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // проверка токенов авторизованных пользователей, вернувшихся в приложение
  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt)
      // проверяем токен
      auth
        .checkToken(jwt)
        .then((res) => {
          // авторизуем пользователя, если токен найден, перенаправляя его на главную страницу
          if (res) {
            setMail(res.data.email);
            setIsLoggedIn(true);
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [navigate]);

  // попап добавления карточки

  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    api
      .addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardLike(card) {
    // проверка есть ли лайк на текущей карточке
    // возвращает тру если среди лайкoв есть лайк пользователя
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // console.log(isLiked)

    // если пользователь не поставил лайк, то мы должны его добавить
    if (!isLiked) {
      api
        .likeCard(card._id)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api
        .deleteLikeCard(card._id)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // обработчик удаления карточки
  function handleCardDelete() {
    setIsLoading(true);
    api
      .deleteCards(deleteCard._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== deleteCard._id);
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // функции открытия попапов

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleDeleteCard(card) {
    setIsDeleteCard(true);
    setDeleteCard(card);
  }

  function handleInfoTooLtip() {
    setIsInfoTooLtip(true);
  }

  // функция закрытия попапов

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteCard(false);
    setSelectedCard({});
    setDeleteCard({});
    setIsInfoTooLtip(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // обработчик изменения информации о пользователе

  function handleUpdateUser(user) {
    setIsLoading(true);
    api
      .editUserInfo(user)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // обработчик изменения аватара пользователя

  function handleUpdateAvatar(item) {
    setIsLoading(true);
    api
      .editAvatar(item)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // обработчик регистрации пользователя
  function onRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        setTitle("Вы успешно зарегистрировались!");
        setImage(register);
     //   console.log(res);
        navigate("/sign-in");
      })
      .catch((err) => {
        setTitle("Что-то пошло не так! Попробуйте ещё раз.");
        setImage(notRegister);
        console.log(err);
      })
      .finally(handleInfoTooLtip);
  }

  //обработчик авторизации пользователя
  function onlogin(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        setIsLoggedIn(true);
      //  console.log(res);
        navigate("/");
        // сохранение токена
        localStorage.setItem("jwt", res.token);
      })
      .catch((err) => {
        console.log(err);
        setTitle("Что-то пошло не так! Попробуйте ещё раз.");
        setImage(notRegister);
        handleInfoTooLtip()
      });
  }

  // удаление токена при выходе
  function signOut() {
    // удаление токена
    localStorage.removeItem("jwt");
    navigate("/sign-in");
    setIsLoggedIn(false);
  }

  return (
    // Подключаем дерево компонентов к провайдеру контекста
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/sign-in"
            element={
              <>
                <Header
                  mail=""
                  title="Регистрация"
                  to="/sign-up"
                  isLoggedIn={isLoggedIn}
                />
                <Login onlogin={onlogin} />
              </>
            }
          ></Route>
          <Route
            path="/sign-up"
            element={
              <>
                <Header mail="" title="Войти" to="/sign-in" isLoggedIn={isLoggedIn} />
                <Register onRegister={onRegister} />
              </>
            }
          ></Route>
          <Route
            path="/"
            element={
              <>
                <Header
                  mail={email}
                  title="Выйти"
                  onClick={signOut}
                  to=""
                  isLoggedIn={isLoggedIn}
                />
                <ProtectedRoute
                  component={Main}
                  loggedIn={isLoggedIn}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteCard}
                  cards={cards}
                />
              </>
            }
          ></Route>
          <Route element={<Navigate to={isLoggedIn ? "/" : "/sign-in"} />} />
        </Routes>;
        {isLoggedIn ? <Footer /> : <></>}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        ></EditProfilePopup>

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          addNewCard={handleAddPlaceSubmit}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        ></AddPlacePopup>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        ></EditAvatarPopup>

        <DeleteCard
          isOpen={isDeleteCard}
          onClose={closeAllPopups}
          onDeleteCard={handleCardDelete}
          card={deleteCard}
          isLoading={isLoading}
        ></DeleteCard>

        <ImagePopup
          card={selectedCard}
          isOpen={selectedCard.link}
          onClose={closeAllPopups}
        />
        <InfoTooLtip
          image={image}
          title={title}
          onClose={closeAllPopups}
          isOpen={isInfoTooLtip}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;







