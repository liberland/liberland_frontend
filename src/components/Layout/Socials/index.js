import React from 'react';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import Paragraph from 'antd/es/typography/Paragraph';
import LiberlandSeal from '../../../assets/icons/seal.svg';
import { socials } from '../../../constants/navigationList';
import styles from '../styles.module.scss';

function Socials() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');

  return (
    <Flex vertical={isBiggerThanSmallScreen}>
      <img src={LiberlandSeal} alt="seal of liberland" className={styles.seal} />
      <div className={styles.nextToSeal}>
        <Paragraph>
          Free Republic of Liberland is a sovereign state & constitutional
          republic with elements of direct democracy.
        </Paragraph>
        <Flex wrap gap="20px">
          {socials.map(({
            icon,
            label,
            href,
          }) => {
            const Icon = icon;
            return (
              <a href={href} aria-label={label} key={href} className={styles.social}>
                <Icon alt="icon" />
              </a>
            );
          })}
        </Flex>
      </div>
    </Flex>
  );
}

export default Socials;
