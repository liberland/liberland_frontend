import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'antd/es/avatar';
import Globe from '../../../assets/icons/globe.svg';
import Button from '../../Button/Button';
import { registriesActions } from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import { generatePdf } from '../../../api/middleware';
import ManageInfo from '../ManageInfo';
import ShowInfo from '../ShowInfo';
import CopyInput from '../../CopyInput';
import router from '../../../router';

export default function CompanyActions({
  registeredCompany,
  type,
}) {
  const dispatch = useDispatch();
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
          <ManageInfo registeredCompany={registeredCompany} />
          <ShowInfo registeredCompany={registeredCompany} />
        </>
      );
    case 'requested':
      return (
        <>
          <ManageInfo registeredCompany={registeredCompany} />
          <ShowInfo registeredCompany={registeredCompany} />
        </>
      );
    case 'all':
      return (
        <>
          <ShowInfo registeredCompany={registeredCompany} />
          {website && (
            <Button
              href={website}
            >
              <Avatar size={18} src={Globe} />
              <span className="hidden">
                Website
              </span>
            </Button>
          )}
        </>
      );
    case 'detail':
      return (
        <>
          {website && (
            <Button
              href={website}
            >
              <Avatar size={18} src={Globe} />
              <span className="hidden">
                Website
              </span>
            </Button>
          )}
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
          {website && (
            <Button
              href={website}
            >
              <Avatar size={18} src={Globe} />
              <span className="hidden">
                Website
              </span>
            </Button>
          )}
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
        </>
      );
    default:
      return null;
  }
}

CompanyActions.propTypes = {
  registeredCompany: PropTypes.shape({
    id: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    onlineAddresses: PropTypes.arrayOf(PropTypes.object),
    charterURL: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['requested', 'mine', 'all', 'detail', 'detail-request']),
};
