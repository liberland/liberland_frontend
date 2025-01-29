import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import styles from './styles.module.scss';

function MoneyCard({
  actions,
  title,
  icon,
  alt,
  amount,
  description,
}) {
  return (
    <Card
      size="small"
      className={styles.card}
      actions={actions ? [
        <Flex wrap gap="15px" align="start">
          {actions}
        </Flex>,
      ] : undefined}
    >
      <Card.Meta
        title={(
          <span className={styles.name}>
            {title}
          </span>
        )}
      />
      <Flex wrap gap="5px" align="center">
        <Title level={5} className={styles.title}>
          {amount}
        </Title>
        {icon && (
          typeof icon === 'string' ? (
            <Avatar size={22} src={icon} alt={alt} />
          ) : icon
        )}
      </Flex>
      {description && (
        <div className="description">
          {description}
        </div>
      )}
    </Card>
  );
}

MoneyCard.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.node,
  icon: PropTypes.node,
  alt: PropTypes.string,
  amount: PropTypes.string,
  description: PropTypes.node,
};

export default MoneyCard;
