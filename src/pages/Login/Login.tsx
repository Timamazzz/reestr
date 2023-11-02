import React, { FC } from "react";
import "./styles.scss";
import LoginForm from "../../components/LoginForm/LoginForm";
import icons from "../../assets/icons/icons";

const Login: FC = () => {
  return (
    <div className="loginPage">
      <div className="loginHeader">
        <img src={icons.Logo} className="logo"></img>
        <p>
          Реестр межведомственных и внутриведомственных процессов исполнительных
          и государственных органов Белгородской области
        </p>
      </div>
      <LoginForm />
      <div className="loginFooter">
        <img src={icons.Mark} className="indicatorLogo"></img>
        <p className="indicatorText">Индикатор</p>
      </div>
    </div>
  );
};

export default Login;
