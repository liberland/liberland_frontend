import React, { useState } from 'react';
import { Header as HeaderInternal } from 'antd/es/layout/layout';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import Modal from 'antd/es/modal';
import styles from '../styles.module.scss';
import UrlMenu from '../UrlMenu';
import { ReactComponent as LiberlandLettermarkMobile } from '../../../assets/icons/Liberland_Lettermark_Mobile.svg';
import UserMenu from '../../UserMenu';

function MobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HeaderInternal
        className={styles.header}
        onClick={() => setOpen(true)}
      >
        <MenuOutlined
          className={styles.menuIcon}
          onClick={() => setOpen(true)}
          aria-label="Open pagination menu"
        />
        <LiberlandLettermarkMobile alt="logo" className={styles.mobileLogo} />
        <div className={styles.mobileUser} onClick={(e) => e.stopPropagation()}>
          <UserMenu />
        </div>
      </HeaderInternal>
      <Modal
        open={open}
        footer={null}
        closable
        maskClosable
        onCancel={(event) => {
          event.stopPropagation();
          setOpen(false);
        }}
        className={styles.mobileMenuOpen}
        classNames={{
          content: styles.mobileMenuOpenContent,
        }}
      >
        <UrlMenu onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export default MobileHeader;
