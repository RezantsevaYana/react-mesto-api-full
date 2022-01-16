import React from "react";
import pencilLogo from "../images/pancil.svg";
import plusLogo from "../images/plus.svg";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {
  // подпишем компонент на контекст
  const currentUser = React.useContext(CurrentUserContext);
  
  return (
      <main className="content">
        <section className="profile">
          <button className="profile__avatar-button" onClick={props.onEditAvatar}>
            <img
              src={currentUser.avatar}
              className="profile__avatar"
              alt="Аватар пользователя"
            />
          </button>

          <div className="profile__info">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button
              className="profile__button"
              type="button"
              onClick={props.onEditProfile}
            >
              <img src={pencilLogo} className="profile__image" alt="Карандаш" />
            </button>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>
          <button
            className="profile__addbutton"
            type="button"
            onClick={props.onAddPlace}
          >
            <img src={plusLogo} className="profile__image" alt="Плюс" />
          </button>
        </section>
        <section className="elements">
          {props.cards.map((cards) => {
            return (
              <Card
                key={cards._id}
                card={cards}
                onCardClick={props.onCardClick}
                onCardLike={props.onCardLike}
                onCardDelete={props.onCardDelete}
              ></Card>
            );
          })}
        </section>
      </main>
  );
}

export default Main;