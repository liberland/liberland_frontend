/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Typography from 'antd/es/typography';
import message from 'antd/es/message';
import {
  TeamOutlined,
} from '@ant-design/icons';
import { blockchainSelectors } from '../../redux/selectors';
import CreateMultisigModal from './CreateMultisigModal';
import { loadMultisigsFromStorage } from '../../utils/multisig';
import { getMultisigAccountInfo } from '../../api/nodeRpcCall';
import MultisigCard from './MultisigCard';

const { Title, Text } = Typography;

function ShowMultisigs() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [multisigs, setMultisigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserMultisigs = async () => {
      setLoading(true);
      try {
        const localMultiSigs = loadMultisigsFromStorage();
        const multisigInfos = await Promise.all(localMultiSigs.map(async (multisig) => {
          const info = await getMultisigAccountInfo(multisig.address);
          return {
            ...multisig,
            ...info,
          };
        }));
        setMultisigs(multisigInfos);
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
