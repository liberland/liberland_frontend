import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import Button from '../../Button/Button';
import { blockchainSelectors } from '../../../redux/selectors';
import { generatePdf } from '../../../api/middleware';
import ManageInfo from '../ManageInfo';
import ShowInfo from '../ShowInfo';
import CopyInput from '../../CopyInput';
import router from '../../../router';
import TradeButton from '../TradeButton';

export default function CompanyActions({
  registeredCompany,
  type,
  getRelevantAssets,
  getRelevantPools,
}) {
  const website = useMemo(() => {
    const url = registeredCompany?.onlineAddresses?.[0]?.url;
    if (!url) {
      return url;
    }
    const sanitized = url?.includes('http') ? url : `https://${url}`;
    return sanitized;
  }, [registeredCompany]);
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

  const companyLink = router.companies.view.replace(':companyId', registeredCompany.id);

  const manageAndShowInfo = (
    <>
      <ManageInfo registeredCompany={registeredCompany} />
      <ShowInfo registeredCompany={registeredCompany} />
    </>
  );

  const websiteButton = website && (
    <Button
      href={website}
    >
      <GlobalOutlined />
      <span className="hidden">
        Website
      </span>
    </Button>
  );

  const tradeButton = useMemo(() => {
    const [connected] = getRelevantAssets?.(registeredCompany) || [];
    const { index } = connected?.[0] || {};
    if (!index) {
      return null;
    }
    const {
      asset1,
      asset2,
      assetData1,
      assetData2,
    } = getRelevantPools?.(index)?.[0] || {};
    if (!asset1 || !asset2) {
      return null;
    }
    const isStock = assetData1.isStock || assetData2.isStock;
    return (
      <TradeButton asset1={asset1} asset2={asset2} isStock={isStock}>
        Trade
      </TradeButton>
    );
  }, [getRelevantAssets, getRelevantPools, registeredCompany]);

  switch (type) {
    case 'mine':
      return (
        <>
          <CopyInput
            buttonLabel="Copy link"
            value={(
              `${window.location.protocol}//${window.location.host}${companyLink}`
            )}
            hideLink
          />
          {manageAndShowInfo}
        </>
      );
    case 'requested':
      return manageAndShowInfo;
    case 'all':
      return (
        <>
          {tradeButton}
          <ShowInfo registeredCompany={registeredCompany} />
          {websiteButton}
        </>
      );
    case 'detail':
      return (
        <>
          {tradeButton}
          {websiteButton}
          <Button
            onClick={() => handleGenerateButton(registeredCompany.id)}
          >
            Generate Certificate
          </Button>
        </>
      );
    case 'detail-request':
      return (
        <>
          {tradeButton}
          {websiteButton}
        </>
      );
    default:
      return null;
  }
}

CompanyActions.propTypes = {
  registeredCompany: PropTypes.shape({
    id: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    onlineAddresses: PropTypes.arrayOf(PropTypes.object),
    charterURL: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['requested', 'mine', 'all', 'detail', 'detail-request']),
  getRelevantAssets: PropTypes.func,
  getRelevantPools: PropTypes.func,
};
