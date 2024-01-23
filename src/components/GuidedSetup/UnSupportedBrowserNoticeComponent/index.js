import React from 'react';
import PropTypes from 'prop-types';

function UnsupportedBrowserNoticeComponent({ onAccept }) {
  return (
    <div>
      <h2>Unsupported browser</h2>
      <p>You seem to be using an unsupported browser like Brave.</p>
      <br />
      <p>Some browsers require registering the blockchains network from the browsers developers.</p>
      <br />
      <p>This is not possible until our network grows.</p>
      <br />
      <p>
        Please use another browser like
        {' '}
        <b>Firefox, Chrome, or Subwallet app</b>
        .
      </p>
      <br />
      <p>
        Alternatively, if you understand that the app might not work correctly in your browser,
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <i><button onClick={onAccept}>click here to proceed</button></i>
        .
      </p>
    </div>
  );
}

UnsupportedBrowserNoticeComponent.propTypes = {
  onAccept: PropTypes.func.isRequired,
};

export default UnsupportedBrowserNoticeComponent;
