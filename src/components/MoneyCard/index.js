import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import classNames from 'classnames';
import { useMediaQuery } from 'usehooks-ts';
import Title from 'antd/es/typography/Title';
import styles from './styles.module.scss';

function MoneyCard({
  actions,
  title,
  icon,
  alt,
  amount,
  description,
  className,
  noBorder,
}) {
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');

  return (
    <Card
      size="small"
      variant={noBorder ? 'borderless' : undefined}
      className={classNames(styles.card, className)}
      actions={isBiggerThanDesktop && actions ? [
        <Flex wrap gap="15px" align="start">
          {actions}
        </Flex>,
      ] : undefined}
    >
      <Flex wrap gap="15px" justify="space-between" align="center">
        <Flex vertical gap="5px">
          <span className={styles.name}>
            {title}
          </span>
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
        </Flex>
        {!isBiggerThanDesktop && (
          <Flex wrap gap="15px">
            {actions}
          </Flex>
        )}
      </Flex>
    </Card>
  );
}

MoneyCard.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.node,
  icon: PropTypes.node,
  alt: PropTypes.string,
  amount: PropTypes.node,
  description: PropTypes.node,
  className: PropTypes.string,
  noBorder: PropTypes.bool,
};

export default MoneyCard;
