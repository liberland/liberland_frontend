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
    addSuccess(notification) {
      setNotifications([
        ...notifications,
        {
          mode: 'success',
          heading: 'Success',
          text: notification.text,
          id: new Date().valueOf() * Math.random(),
        },
      ]);
    },
    addError(notification) {
      setNotifications([
        ...notifications,
        {
          mode: 'error',
          heading: 'Error',
          text: notification.text,
          id: new Date().valueOf() * Math.random(),
        },
      ]);
    },
    addWarning(notification) {
      setNotifications([
        ...notifications,
        {
          mode: 'warning',
          heading: 'Warning',
          text: notification.text,
          id: new Date().valueOf() * Math.random(),
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
  ) : null;
});

NotificationPortal.propTypes = {
  closingTime: PropTypes.number,
};

NotificationPortal.defaultProps = {
  closingTime: 2000,
};

export default NotificationPortal;
