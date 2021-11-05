import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { useNotofication } from '../../hooks/useNotificationPortal';
import Notification from '../Notification';

import styles from './styles.module.scss';

const NotificationMessage = {
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const NotificationPortal = forwardRef(({ closingTime }, ref) => {
  const [notifications, setNotifications] = useState([]);
  const [removing, setRemoving] = useState('');
  const { loaded, portalId } = useNotofication();

  const removeNotifications = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (removing) {
      setNotifications((n) => n.filter((i) => i.id !== removing));
    }
  }, [removing]);

  useEffect(() => {
    if (notifications.length) {
      const nId = notifications[notifications.length - 1].id;
      setTimeout(() => {
        setRemoving(nId);
      }, closingTime);
    }
  }, [notifications]);

  useImperativeHandle(ref, () => ({
    addMessage(notification) {
      setNotifications([
        ...notifications,
        {
          text: notification.text,
          mode: notification.mode,
          id: new Date().valueOf() * Math.random(),
          heading: NotificationMessage[notification.mode],
        },
      ]);
    },
  }));

  return loaded ? ReactDOM.createPortal(
    <div className={styles.notificationContainer}>
      {notifications.map((n) => (
        <Notification
          key={n.id}
          mode={n.mode}
          text={n.text}
          heading={n.heading}
          onClose={() => removeNotifications(n.id)}
        />
      ))}
    </div>,
    document.getElementById(portalId),
  ) : <></>;
});

NotificationPortal.propTypes = {
  closingTime: PropTypes.number,
};

NotificationPortal.defaultProps = {
  closingTime: 2000,
};

export default NotificationPortal;
