import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const modalContainer = (id) => {
  const existing = document.getElementById(id);
  if (!existing) {
    const newElement = document.createElement('div');
    newElement.id = id;
    newElement.className = 'modal-root';
    document.body.appendChild(newElement);
    return newElement;
  }
  return existing;
};

function ModalRoot({ children, id, closeModal }) {
  const root = useRef(modalContainer(id));
  useEffect(() => {
    root.current.classList.add('active');
    document.body.style.overflow = 'hidden';
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      root.current.classList.remove('active');
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!closeModal) return null;
    const rootElement = root.current;
    const handleClick = (event) => {
      if (event.target === rootElement) {
        closeModal();
      }
    };

    rootElement.addEventListener('click', handleClick);
    return () => {
      rootElement.removeEventListener('click', handleClick);
    };
  }, [closeModal]);

  const customChildren = React.Children.map(children, (child) => {
    const props = { root };
    return React.cloneElement(child, props);
  });

  const content = (
    <div className={children.props.proposal?.proposalModalShown ? 'modal-wrapper modal-text-wrapper' : 'modal-wrapper'}>
      <div>
        { customChildren }
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    content,
    root.current,
  );
}

ModalRoot.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  closeModal: PropTypes.func,
};

ModalRoot.defaultProps = {
  id: 'modal-root',
};

export default ModalRoot;
