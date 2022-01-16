import React from "react";

function PopupWithForm(props) {
  return (
    <section
      className={`popup popup${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className={`popup__container popup__container${props.name}`}>
        <button
          className={`popup__close popup__close${props.name}`}
          type="button"
          onClick={props.onClose}
        ></button>
        <h2 className={`popup__title popup__title${props.name}`}>
          {props.title}
        </h2>
        <form
          className={`popup__form popup__form${props.name}`}
          name={props.name}
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button className="popup__button" type="submit">
            {props.isLoading ? props.buttonTextLoading : props.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;