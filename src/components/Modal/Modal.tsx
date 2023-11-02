import React, { FC, useEffect } from "react";
import "./styles.scss";

interface ModalProps {
  content: React.ReactNode;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ content, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div>
      <div className="modalContainerBg" onClick={onClose}></div>
      <div className="modal">{content}</div>
    </div>
  );
};

export default Modal;
