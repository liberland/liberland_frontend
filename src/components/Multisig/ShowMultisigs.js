import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Typography from 'antd/es/typography';
import Collapse from 'antd/es/collapse';
import message from 'antd/es/message';
import Result from 'antd/es/result';
import {
  TeamOutlined,
} from '@ant-design/icons';
import { blockchainSelectors } from '../../redux/selectors';
import CreateMultisigModal from './CreateMultisigModal';
import { loadMultisigsFromStorage } from '../../utils/multisig';
import { getMultisigAccountInfo } from '../../api/nodeRpcCall';
import MultisigCard from './MultisigCard';

const { Text } = Typography;

function ShowMultisigs() {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [multisigs, setMultisigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMultisigs = useCallback(async () => {
    setLoading(true);
    try {
      const localMultiSigs = loadMultisigsFromStorage();
      const multisigInfos = await Promise.all(localMultiSigs.map(
        async (multisig) => {
          const info = await getMultisigAccountInfo(multisig.address);
          return {
            ...multisig,
            ...info,
          };
        },
      ));
      setMultisigs(multisigInfos);
    } catch (error) {
      message.error('Failed to load multisig accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMultisigs();
  }, [loadMultisigs]);

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
      message.error('Failed to export signatories');
    }
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

  const collapseContent = () => {
    if (loading) {
      return (
        <Card>
          <Flex justify="center" align="center" style={{ padding: 40 }}>
            <Text>Loading multisig accounts...</Text>
          </Flex>
        </Card>
      );
    }

    if (multisigs.length === 0) {
      return (
        <Result
          icon={<TeamOutlined />}
          title="No multisig accounts found"
          subTitle={(
            <div>
              You are not tracking any multisig accounts yet.
              <br />
              Add a new multisig to start tracking.
            </div>
          )}
          extra={<CreateMultisigModal onMultisigCreated={loadMultisigs} />}
        />
      );
    }

    return (
      <div>
        {multisigs.map((multisig) => (
          <MultisigCard
            key={multisig.address}
            multisig={multisig}
            userAddress={userWalletAddress}
            onExportSignatories={handleExportSignatories}
            onMultisigRemoved={loadMultisigs}
            onActionCompleted={loadMultisigs}
          />
        ))}
      </div>
    );
  };

  return (
    <Collapse
      collapsible="icon"
      defaultActiveKey={['tracking-multisigs']}
      items={[{
        key: 'tracking-multisigs',
        label: 'Tracking Multisigs',
        children: collapseContent(),
        extra: (
          <CreateMultisigModal onMultisigCreated={loadMultisigs} />
        ),
      }]}
    />
  );
}

export default ShowMultisigs;
