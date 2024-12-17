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

function ModalRoot({ children, id }) {
  const root = useRef(modalContainer(id));

  useEffect(() => {
    const rootCurrent = root.current;
    const handleBackgroundClick = (event) => {
      if (event.target === rootCurrent) {
        if (children.props.closeModal) {
          children.props.closeModal();
        }
      }
    };

    rootCurrent.classList.add('active');
    document.body.style.overflow = 'hidden';

    rootCurrent.addEventListener('click', handleBackgroundClick);

    return () => {
      rootCurrent.classList.remove('active');
      document.body.style.overflow = 'unset';
      rootCurrent.removeEventListener('click', handleBackgroundClick);
    };
  }, [children.props]);

  const customChildren = React.Children.map(children, (child) => {
    const props = { root };
    return React.cloneElement(child, props);
  });

  const content = (
    <div className={children.props.proposal?.proposalModalShown ? 'modal-wrapper modal-text-wrapper' : 'modal-wrapper'}>
      <div>
        {customChildren}
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
};

ModalRoot.defaultProps = {
  id: 'modal-root',
};

export default ModalRoot;
