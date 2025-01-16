import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import Button from '../../Button/Button';
import { registriesActions } from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import { generatePdf } from '../../../api/middleware';
import ManageInfo from '../ManageInfo';
import ShowInfo from '../ShowInfo';

export default function CompanyActions({
  registeredCompany,
  type,
}) {
  const dispatch = useDispatch();
  const website = registeredCompany?.onlineAddresses?.[0]?.url?.value;
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

  switch (type) {
    case 'mine':
      return (
        <>
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
        </>
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
