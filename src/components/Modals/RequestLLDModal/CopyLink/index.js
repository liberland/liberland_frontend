import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import NotificationPortal from '../../../NotificationPortal';
import Button from '../../../Button/Button';

function CopyLink({
  link,
}) {
  const notificationRef = useRef();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(link);
    notificationRef.current.addSuccess({ text: 'Link was copied' });
  };

  return (
    <>
      <Button small primary type="button" onClick={handleCopyClick}>
        Copy link
      </Button>
      <NotificationPortal ref={notificationRef} />
    </>
  );
}

CopyLink.propTypes = {
  link: PropTypes.string.isRequired,
};

export default CopyLink;
