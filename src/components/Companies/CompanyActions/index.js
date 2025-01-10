import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import Flex from 'antd/es/flex';
import Popover from 'antd/es/popover';
import router from '../../../router';
import Button from '../../Button/Button';
import CompanyDetail from '../CompanyDetail';
import { registriesActions } from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import { generatePdf } from '../../../api/middleware';
import styles from './styles.module.scss';

export default function CompanyActions({
  registeredCompany,
  type,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const website = registeredCompany?.onlineAddresses?.[0]?.url;
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const handleGenerateButton = async (companyId) => {
    const pathName = 'certificate';
    const blob = await generatePdf(companyId, pathName, blockNumber);
    const href = URL.createObjectURL(blob);
    const file = `${pathName}.pdf`;
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', file);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const showInfo = (
    <Popover
      content={<CompanyDetail mainDataObject={registeredCompany} showAll />}
    >
      <Button link>
        Show info
      </Button>
    </Popover>
  );
  const manageInfo = (
    <Button
      primary
      onClick={() => history.push(`${router.companies.edit.replace(':companyId', registeredCompany.id)}#requested`)}
    >
      Manage Info
    </Button>
  );

  switch (type) {
    case 'mine':
      return (
        <Flex className={styles.fit} vertical gap="15px">
          {manageInfo}
          {showInfo}
        </Flex>
      );
    case 'requested':
      return (
        <Flex className={styles.fit} vertical gap="15px">
          {manageInfo}
          {showInfo}
        </Flex>
      );
    case 'all':
      return (
        <Flex className={styles.fit} vertical gap="15px">
          {showInfo}
          {website && (
            <Button
              link
              href={website}
            >
              <GlobalOutlined />
              <span className="hidden">
                Website
              </span>
            </Button>
          )}
          <Button
            secondary
            onClick={() => handleGenerateButton(registeredCompany.id)}
          >
            Generate Certificate
          </Button>
          <Button
            red
            onClick={() => dispatch(
              registriesActions.cancelCompanyRequest.call({
                companyId: registeredCompany.id,
              }),
            )}
          >
            Delete request
          </Button>
        </Flex>
      );
    default:
      return null;
  }
}

CompanyActions.propTypes = {
  registeredCompany: PropTypes.shape({
    id: PropTypes.string.isRequired,
    onlineAddresses: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  type: PropTypes.oneOf(['requested', 'mine', 'all']),
};
