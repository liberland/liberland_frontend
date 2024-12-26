import React from 'react';
import PropTypes from 'prop-types';
import notification from 'antd/es/notification';
import Button from '../../../Button/Button';

function CopyLink({
  link,
}) {
  const [api, handle] = notification.useNotification();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(link);
    api.success('Link was copied');
  };

  return (
    <>
      <Button small primary type="button" onClick={handleCopyClick}>
        Copy link
      </Button>
      {handle}
    </>
  );
}

CopyLink.propTypes = {
  link: PropTypes.string.isRequired,
};

export default CopyLink;
