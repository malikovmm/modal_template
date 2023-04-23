import { useState } from "react";
import Modal from "./components/Modal";
import useLocalStorageValue from "./hooks/useLocalStorageValue";
import ILocalStorageValue from "./types/localStorageValue";
import "./styles.scss";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [{ confirmed }] = useLocalStorageValue<ILocalStorageValue>(
    "confirmData",
    { confirmed: false }
  );

  const handleSuccess = () => {
    alert("Действие выполнено");
  };

  const handleModalOpen = () => {
    if (confirmed) {
      return handleSuccess();
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="App">
      <button className="btn" onClick={handleModalOpen}>
        Выполнить действие
      </button>
      <Modal
        isOpen={isModalOpen}
        onModalClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
