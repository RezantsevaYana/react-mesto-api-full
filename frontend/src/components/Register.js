import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // обработчики изменения инпутов
  function handleMailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onRegister(email, password);
  }

  return (
      <div className="main-page">
        <h2 className="main-page__title">Регистрация</h2>
        <form className="main-page__form" onSubmit={handleSubmit}>
          <input
            className="main-page__input"
            id="reg-email-input"
            type="email"
            name="email"
            placeholder="Email"
            value={email || ""}
            onChange={handleMailChange}
            required
          ></input>
          <input
            className="main-page__input"
            id="reg-password-input"
            type="password"
            name="password"
            placeholder="Пароль"
            value={password || ""}
            onChange={handlePasswordChange}
            required
          ></input>
          <button className="main-page__button" type="submit">
            Зарегистрироваться
          </button>
        </form>
        <p className="main-page__subtitle">
          Уже зарегистрированы?{" "}
          <Link to="/sign-in" className="main-page__link">
            Войти
          </Link>
        </p>
      </div>
  );
}

export default Register;