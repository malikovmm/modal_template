import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import useLocalStorageValue from "../../hooks/useLocalStorageValue";
import ILocalStorageValue from "../../types/localStorageValue";
import "./styles.scss";

const modalRoot = document.getElementById("modal");

interface IProps {
  isOpen: boolean;
  onModalClose: () => void;
  onSuccess: () => void;
}

const countdownSeconds = 5;
export default function Modal(props: IProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [{ confirmed }, setConfirmed] =
    useLocalStorageValue<ILocalStorageValue>("confirmData", {
      confirmed: false,
    });

  useEffect(() => {
    if (!props.isOpen) {
      return;
    }
    const intervalId = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);
    return () => {
      setCountdown(countdownSeconds);
      clearInterval(intervalId);
    };
  }, [props.isOpen, confirmed]);

  const handleConfirm = () => {
    setConfirmed({ confirmed: true });
    props.onModalClose();
    props.onSuccess();
  };

  const handleCancel = () => {
    setConfirmed({ confirmed: false });
    props.onModalClose();
  };

  if (!props.isOpen) return null;

  if (!modalRoot) {
    console.error("modal root is null");
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-body">
        <div className="modal-header">
          <h2 className="modal-title">Согласие с правилами</h2>
          <button className="modal-close" onClick={props.onModalClose}>
            ×
          </button>
        </div>
        <div className="modal-info">
          <p>
            Для данной функции применяются особые условия и правила пользования,
            их необходимо подтвердить, нажав на кнопку Подтвердить
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn"
            onClick={handleConfirm}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `Подтвердить (${countdown})` : "Подтвердить"}
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
