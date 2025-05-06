import * as types from 'prop-types';

import './style.scss';

const Modal = ({ isOpen = true, setIsOpen, title, inputs }) => {
  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <>
      {isOpen && (
        <section className="modal">
          <div className="background" onClick={closeModal} />

          <div className="content">
            <div className="close" onClick={closeModal}>&times;</div>
            <h2 className="title">{title}</h2>

            <div className="inputs-container">
              {
                inputs?.map((input,index) => (
                  <div key={index} className="input">
                    <span className="desc">{input.desc}:</span>
                    <span className="value">{input.value}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Modal;

Modal.propTypes = {
  isOpen: types.bool,
  setIsOpen: types.func,
  title: types.string,
  inputs: types.array
}