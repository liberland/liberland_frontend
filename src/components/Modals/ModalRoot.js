import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const modalContainer = document.getElementById('modal-root');

const ModalRoot = ({ children }) => {
  const root = useRef(modalContainer);

  useEffect(() => {
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden';

    return () => {
      modalContainer.classList.remove('active');
      document.body.style.overflow = 'unset';
    };
  }, []);

  const customChildren = React.Children.map(children, (child) => {
    const props = { root };

    return React.cloneElement(child, props);
  });

  const content = (
    <div className={children.props.proposal?.proposalModalShown ? 'modal-wrapper modal-text-wrapper' : 'modal-wrapper'}>
      { customChildren }
    </div>
  );

  return ReactDOM.createPortal(
    content,
    modalContainer,
  );
};

export default ModalRoot;
