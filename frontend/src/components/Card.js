import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  // подписываем компонент на контекст
  const currentUser = React.useContext(CurrentUserContext);

  // определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;

  // переменная с помощью которой определяется видиомсть иконки удаления на карточке

  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? " " : "element__delete_disabled"
  }`;

  // определяем есть ли у карточки лайк
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  // переменная с помощью которой определяется стоит лайк или нет

  const cardLikeButtonClassName = `element__button ${
    isLiked ? "element__button_active" : " "
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleCardDeletePopup() {
    props.onCardDelete(props.card);
  }

  return (
      <article className="element">
        <button
          className={cardDeleteButtonClassName}
          type="button"
          onClick={handleCardDeletePopup}
        ></button>
        <img
          src={props.card.link}
          className="element__photo"
          alt={props.card.name}
          onClick={handleClick}
        />
        <div className="element__container">
          <h2 className="element__title">{props.card.name}</h2>
          <div className="element__likes">
            <button
              className={cardLikeButtonClassName}
              type="button"
              onClick={handleLikeClick}
            ></button>
            <p className="element__counter">{props.card.likes.length}</p>
          </div>
        </div>
      </article>
  );
}

export default Card;






