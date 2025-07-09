import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Tag from 'antd/es/tag';
import Badge from 'antd/es/badge';
import Typography from 'antd/es/typography';
import Tooltip from 'antd/es/tooltip';
import Dropdown from 'antd/es/dropdown';
import {
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  MoreOutlined,
  TeamOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import Button from '../Button/Button';
import CopyIconWithAddress from '../CopyIconWithAddress';
import MultisigApproveModal from './MultisigApprove';
import { TransferFormComponent } from './TransferModal';
import { formatDollars } from '../../utils/walletHelpers';
import { removeMultisigFromStorage, getUserMultisigs } from '../../utils/multisig';
import { useModal } from '../../context/modalContext';

const { Text } = Typography;

function MultisigCard({
  multisig,
  userAddress,
  onExportSignatories,
  onMultisigRemoved,
  onActionCompleted,
}) {
  const { showModal, closeLastNModals } = useModal();

  const handleSendClick = () => {
    const userMultisigs = getUserMultisigs(userAddress);
    showModal(
      <TransferFormComponent
        multisigAddress={multisig.address}
        userAddress={userAddress}
        multisigData={{
          signatories: multisig.signatories,
          threshold: multisig.threshold,
        }}
        userMultisigs={userMultisigs}
        onClose={() => closeLastNModals(1)}
        onSuccess={() => {
          onActionCompleted();
        }}
      />,
    );
  };

  const handleViewApprovals = () => {
    showModal(
      <MultisigApproveModal
        multisig={multisig}
        userAddress={userAddress}
        onActionCompleted={onActionCompleted}
      />,
    );
  };

  const isSignatory = multisig.signatories.includes(userAddress);

  const menuItems = [
    {
      key: 'export',
      label: 'Export Signatories',
      icon: <DownloadOutlined />,
      onClick: () => onExportSignatories(multisig),
    },
    {
      key: 'approvals',
      label: 'View Approvals',
      icon: <FileTextOutlined />,
      disabled: multisig.pendingTxs.length === 0,
      onClick: handleViewApprovals,
    },
    {
      key: 'remove',
      label: 'Remove',
      icon: <DeleteOutlined />,
      onClick: () => {
        removeMultisigFromStorage(multisig.address);
        onMultisigRemoved();
      },
    },
  ];

  return (
    <Card
      title={(
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={8}>
            <TeamOutlined />
            <Text strong>{multisig.name}</Text>
            {!isSignatory && <Tag color="orange">Observer</Tag>}
          </Flex>
        </Flex>
      )}
      extra={(
        <Flex gap={12}>
          <Button onClick={handleSendClick}>Send</Button>
          {multisig.pendingTxs.length > 0 && (
            <Badge count={multisig.pendingTxs.length} color="orange">
              <Button onClick={handleViewApprovals}>View Approvals</Button>
            </Badge>
          )}
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button size="small" icon={<MoreOutlined />}>
              <MenuOutlined />
            </Button>
          </Dropdown>
        </Flex>
      )}
      style={{ marginBottom: 16 }}
    >
      <Flex vertical gap={12}>
        <Flex justify="space-between">
          <Text type="secondary">Address:</Text>
          <CopyIconWithAddress address={multisig.address} />
        </Flex>

        <Flex justify="space-between">
          <Text type="secondary">Threshold:</Text>
          <Text>
            {multisig.threshold}
            {' of '}
            {multisig.signatories.length}
          </Text>
        </Flex>

        <Flex justify="space-between">
          <Text type="secondary">Balance:</Text>
          <Flex vertical align="end">
            <Text>
              {formatDollars(multisig.balance.total)}
              {' LLD'}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {formatDollars(multisig.balance.transferable)}
              {' transferable'}
            </Text>
          </Flex>
        </Flex>

        <div>
          <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
            Signatories:
          </Text>
          <Flex wrap gap={4}>
            {multisig.signatories.map((address) => (
              <Tooltip key={address} title={address}>
                <Tag
                  color={address === userAddress ? 'blue' : 'default'}
                  style={{ cursor: 'pointer' }}
                >
                  {address === userAddress ? 'You' : `${address.slice(0, 6)}...${address.slice(-4)}`}
                </Tag>
              </Tooltip>
            ))}
          </Flex>
        </div>
      </Flex>
    </Card>
  );
}

MultisigCard.propTypes = {
  multisig: PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired,
    signatories: PropTypes.arrayOf(PropTypes.string).isRequired,
    balance: PropTypes.shape({
      total: PropTypes.string.isRequired,
      transferable: PropTypes.string.isRequired,
    }).isRequired,
    pendingTxs: PropTypes.arrayOf(PropTypes.shape({
      callHash: PropTypes.string.isRequired,
      multisig: PropTypes.shape({
        when: PropTypes.shape({
          height: PropTypes.number,
          index: PropTypes.number,
        }).isRequired,
        depositor: PropTypes.string.isRequired,
        approvals: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    })).isRequired,
  }).isRequired,
  userAddress: PropTypes.string.isRequired,
  onExportSignatories: PropTypes.func.isRequired,
  onMultisigRemoved: PropTypes.func.isRequired,
  onActionCompleted: PropTypes.func.isRequired,
};

export default MultisigCard;
