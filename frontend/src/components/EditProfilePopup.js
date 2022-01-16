import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import PopupWithForm from "./PopupWithForm.js";

function EditProfilePopup(props) {
  // подписка на контекст
  const currentUser = React.useContext(CurrentUserContext);
  // стейты в которых содержаться значения инпутов
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // обработчики изменения инпутов
  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  // после зарузки данных о пользователе с апи, эти данные будут использоваться в управляемых компонентах

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      name="_js_editor"
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isLoading={props.isLoading}
      buttonText="Сохранить"
      buttonTextLoading="Сохранение..."
    >
      <input
        id="name-input"
        type="text"
        className="popup__input popup__input_info_name"
        name="name"
        placeholder="Ваше имя"
        value={name || ""}
        onChange={handleNameChange}
        minLength="2"
        maxLength="30"
      />
      <span className="error name-input-error"></span>
      <input
        id="description-input"
        type="text"
        className="popup__input popup__input_info_job"
        name="about"
        placeholder="Ваш род деятельности"
        value={description || ""}
        onChange={handleDescriptionChange}
        minLength="2"
        maxLength="30"
      />
      <span className="error description-input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;