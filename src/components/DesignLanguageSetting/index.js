import React from 'react';
import Flex from 'antd/es/flex';
import Radio from 'antd/es/radio';
import Alert from 'antd/es/alert';
import { useModeContext } from '../AntdProvider';
import { DESIGNS } from '../../utils/designLanguage';
import styles from './styles.module.scss';

/**
 * Choose the visual language the app is rendered in.
 *
 * Purely presentational: both options run exactly the same application, with
 * the same routes, data and behaviour. Only design tokens change. The choice
 * is remembered in this browser until it is changed again.
 */
function DesignLanguageSetting() {
  const { design, setDesign } = useModeContext();

  return (
    <Flex vertical gap="14px" data-testid="design-language-setting">
      <Radio.Group
        value={design}
        onChange={(e) => setDesign(e.target.value)}
        className={styles.group}
      >
        <Flex vertical gap="10px">
          {Object.values(DESIGNS).map((d) => (
            <Radio key={d.key} value={d.key} data-testid={`design-option-${d.key}`}>
              <span className={styles.label}>{d.label}</span>
              <span className={styles.description}>{d.description}</span>
            </Radio>
          ))}
        </Flex>
      </Radio.Group>
      <Alert
        type="info"
        showIcon
        message="This changes appearance only"
        description={'Both languages run the same application — same pages, same data, same '
          + 'actions. Each opens on its native canvas (State is dark, Ledger is light); the '
          + 'moon button still switches light and dark afterwards. Your choice is remembered '
          + 'on this device until you change it.'}
      />
    </Flex>
  );
}

export default DesignLanguageSetting;
