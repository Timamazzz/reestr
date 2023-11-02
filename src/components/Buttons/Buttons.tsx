import React from "react";
import "./styles.scss";

type ButtonsProps = {
  text: string;
  onClick: () => void;
  ico?: string;
  className?: string;
  circle?: string;
};

const Buttons: React.FC<ButtonsProps> = ({
  text,
  onClick,
  ico,
  className,
  circle,
}) => {
  return (
    <button
      className={`button__container ${ico ? "iconContainer" : ""} ${className}`}
      onClick={onClick}
    >
      {circle && <div className="circleNumber">{circle}</div>}
      {ico && <object type="image/svg+xml" data={ico}></object>}
      {text}
    </button>
  );
};

export default Buttons;
