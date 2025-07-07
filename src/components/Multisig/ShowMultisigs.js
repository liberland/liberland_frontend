/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Tag from 'antd/es/tag';
import Badge from 'antd/es/badge';
import Typography from 'antd/es/typography';
import Tooltip from 'antd/es/tooltip';
import Dropdown from 'antd/es/dropdown';
import message from 'antd/es/message';
import {
  DownloadOutlined,
  FileTextOutlined,
  MoreOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Button from '../Button/Button';
import CopyIconWithAddress from '../CopyIconWithAddress';
import { blockchainSelectors } from '../../redux/selectors';
import { formatDollars } from '../../utils/walletHelpers';
import CreateMultisigModal from './CreateMultisigModal';

const { Title, Text } = Typography;

// Mock data for demonstration - replace with actual blockchain calls
const mockMultisigs = [
  {
    address: '5GrHWJRb1DmFbkcpPi5qC3yNmRBdD6VkMZ1kQ9rjN7pZkFzG',
    name: 'Treasury Multisig',
    threshold: 3,
    signatories: [
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
      '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
      '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
    ],
    balance: {
      total: '1250000000000000',
      transferable: '1200000000000000',
    },
    pendingTxs: 2,
    isActive: true,
  },
  {
    address: '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
    name: 'Operations Multisig',
    threshold: 2,
    signatories: [
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
      '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
    ],
    balance: {
      total: '500000000000000',
      transferable: '450000000000000',
    },
    pendingTxs: 0,
    isActive: true,
  },
];

function MultisigCard({
  multisig,
  userAddress,
  onExportSignatories,
  onViewApprovals,
}) {
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
      disabled: multisig.pendingTxs === 0,
      onClick: () => onViewApprovals(multisig),
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
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Flex>
      )}
      extra={
        multisig.pendingTxs > 0 && (
          <Badge count={multisig.pendingTxs} color="orange">
            <Button size="small" onClick={() => onViewApprovals(multisig)}>
              Pending
            </Button>
          </Badge>
        )
      }
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
    pendingTxs: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  userAddress: PropTypes.string.isRequired,
  onExportSignatories: PropTypes.func.isRequired,
  onViewApprovals: PropTypes.func.isRequired,
};

function ShowMultisigs() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [multisigs, setMultisigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load multisigs where user is a signatory
  useEffect(() => {
    const loadUserMultisigs = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual blockchain call
        // This should query the blockchain for multisig accounts where userWalletAddress is a signatory
        const userMultisigs = mockMultisigs.filter((multisig) => multisig.signatories.includes(userWalletAddress));
        setMultisigs(userMultisigs);
      } catch (error) {
        console.error('Failed to load multisigs:', error);
        message.error('Failed to load multisig accounts');
      } finally {
        setLoading(false);
      }
    };

    if (userWalletAddress) {
      loadUserMultisigs();
    }
  }, [userWalletAddress]);

  const handleExportSignatories = useCallback((multisig) => {
    try {
      const data = {
        name: multisig.name,
        address: multisig.address,
        threshold: multisig.threshold,
        signatories: multisig.signatories,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${multisig.name.replace(/\s+/g, '_')}_signatories_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('Signatories exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Failed to export signatories');
    }
  }, []);

  const handleViewApprovals = useCallback((multisig) => {
    // TODO: Implement modal or navigation to approvals view
    console.log('View approvals for:', multisig.address);
    message.info(`Viewing approvals for ${multisig.name} (${multisig.pendingTxs} pending)`);
  }, []);

  if (!userWalletAddress) {
    return (
      <Card>
        <Flex justify="center" align="center" style={{ padding: 40 }}>
          <Text type="secondary">Please connect your wallet to view multisig accounts</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            My Multisig Accounts
          </Title>
          <Text type="secondary">
            Multisig accounts where you are a signatory
          </Text>
        </div>
        <CreateMultisigModal />
      </Flex>

      {loading && (
        <Card>
          <Flex justify="center" align="center" style={{ padding: 40 }}>
            <Text>Loading multisig accounts...</Text>
          </Flex>
        </Card>
      )}
      {!loading && multisigs.length === 0 ? (
        <Card>
          <Flex vertical justify="center" align="center" style={{ padding: 40 }} gap={16}>
            <TeamOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            <Text type="secondary">No multisig accounts found</Text>
            <Text type="secondary" style={{ textAlign: 'center' }}>
              You are not a signatory on any multisig accounts yet.
              <br />
              Create a new multisig or ask to be added to an existing one.
            </Text>
            <CreateMultisigModal />
          </Flex>
        </Card>
      ) : (
        <div>
          {multisigs.map((multisig) => (
            <MultisigCard
              key={multisig.address}
              multisig={multisig}
              userAddress={userWalletAddress}
              onExportSignatories={handleExportSignatories}
              onViewApprovals={handleViewApprovals}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowMultisigs;
