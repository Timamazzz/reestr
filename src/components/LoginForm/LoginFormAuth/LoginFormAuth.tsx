import React, { FC, useState } from "react";
import FormInput from "../../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import Checkbox from "../../Checkbox/Checkbox";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import { AuthActionCreators } from "../../../store/reducers/auth/action-creator";

interface LoginFormProps {
  onForgot: () => void;
}

const LoginFormAuth: FC<LoginFormProps> = ({ onForgot }) => {
  const dispatch = useDispatch();

  const { error, isLoading } = useTypeSelector((state) => state.authReducer);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    //@ts-ignore
    dispatch(AuthActionCreators.login(username, password));
  };

  return (
    <>
      <h1>Вход в систему</h1>
      <FormInput
        style={""}
        value={undefined}
        onChange={(e) => {
          setUsername(e);
        }}
        subInput={"Электронная почта"}
        required={true}
        error={error}
        keyData={""}
        loading={isLoading}
        type="email"
        friedlyInput={true}
      />
      <FormInput
        style={""}
        value={undefined}
        onChange={(e) => {
          setPassword(e);
        }}
        subInput={"Пароль"}
        required={true}
        error={error}
        keyData={""}
        loading={isLoading}
        type="password"
        friedlyInput={true}
      />
      <div className="containerCheck">
        <Checkbox
          id={""}
          label={"Запомнить данные"}
          checked={false}
          onChange={() => {}}
        />
        <p
          onClick={() => {
            onForgot();
          }}
        >
          Забыли пароль
        </p>
      </div>

      <Buttons
        ico={isLoading ? icons.lock : ""}
        text={"Войти"}
        onClick={() => {
          submit();
        }}
        className="buttonLogin"
      />
    </>
  );
};

export default LoginFormAuth;
