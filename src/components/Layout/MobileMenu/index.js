import React, { useState } from 'react';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import styles from '../styles.module.scss';
import CloseableModal from '../../Modals/CloseableModal';
import UrlMenu from '../UrlMenu';

export default function MobileMenu() {
  const [open, setOpen] = useState();
  return (
    <>
      <MenuOutlined
        className={styles.menuIcon}
        onClick={() => setOpen(true)}
        aria-label="Open pagination menu"
      />
      {open && (
        <CloseableModal
          onClose={() => setOpen(false)}
          className={styles.mobileMenuOpen}
          classNames={{
            content: styles.mobileMenuOpenContent,
          }}
        >
          <UrlMenu onNavigate={() => setOpen(false)} />
        </CloseableModal>
      )}
    </>
  );
}
