import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Typography from 'antd/es/typography';
import Select from 'antd/es/select';
import Tag from 'antd/es/tag';
import Input from 'antd/es/input';
import Switch from 'antd/es/switch';
import Alert from 'antd/es/alert';
import Tooltip from 'antd/es/tooltip';
import Space from 'antd/es/space';
import Badge from 'antd/es/badge';
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import notification from 'antd/es/notification';
import Button from '../Button/Button';
import CopyIconWithAddress from '../CopyIconWithAddress';
import modalWrapper from '../Modals/components/ModalWrapper';
import OpenModalButton from '../Modals/components/OpenModalButton';
import {
  approveMultisigTransaction,
  rejectMultisigTransaction,
} from '../../api/nodeRpcCall';

const { Text, Title } = Typography;

function MultisigApprove({
  multisig, userAddress, onClose, onActionCompleted,
}) {
  const [selectedTxHash, setSelectedTxHash] = useState(null);
  const [actionType, setActionType] = useState('approve');
  const [callData, setCallData] = useState('');
  const [showCallData, setShowCallData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Set initial selected transaction
  useEffect(() => {
    if (multisig.pendingTxs.length > 0 && !selectedTxHash) {
      setSelectedTxHash(multisig.pendingTxs[0].callHash);
    }
  }, [multisig.pendingTxs, selectedTxHash]);

  const selectedTx = multisig.pendingTxs.find((tx) => tx.callHash === selectedTxHash);
  const isUserSignatory = multisig.signatories.includes(userAddress);
  const isUserDepositor = selectedTx?.multisig.depositor === userAddress;
  const hasUserApproved = selectedTx?.multisig.approvals.includes(userAddress);
  const canExecute = selectedTx && selectedTx.multisig.approvals.length >= multisig.threshold;
  const needsMoreApprovals = selectedTx && selectedTx.multisig.approvals.length < multisig.threshold;
  const isFinalApproval = selectedTx
    && !hasUserApproved
    && selectedTx.multisig.approvals.length === multisig.threshold - 1;

  useEffect(() => {
    if (actionType === 'reject' && !isUserDepositor) {
      setActionType('approve');
    }
    if (actionType === 'approve' && hasUserApproved && isUserDepositor) {
      setActionType('reject');
    }
  }, [selectedTxHash, actionType, isUserDepositor, hasUserApproved]);

  const handleAction = async () => {
    if (!selectedTx || !isUserSignatory) return;

    setIsSubmitting(true);

    try {
      const otherSignatories = multisig.signatories.filter((address) => address !== userAddress);
      const { when: timepoint } = selectedTx.multisig;
      const { callHash } = selectedTx;

      if (actionType === 'approve') {
        if (hasUserApproved) return;

        await approveMultisigTransaction({
          threshold: multisig.threshold,
          otherSignatories,
          maybeTimepoint: timepoint,
          callHash,
          walletAddress: userAddress,
          isFinalApproval,
          callData,
        });
      } else {
        await rejectMultisigTransaction({
          threshold: multisig.threshold,
          otherSignatories,
          timepoint,
          callHash,
          walletAddress: userAddress,
        });
      }

      onActionCompleted();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      let errorMessage = 'Transaction failed. Please try again.';

      if (error.message?.includes('findMetaCall')) {
        errorMessage = 'Invalid call data provided. Please check the call data from the original transaction creator.';
      } else if (error.message?.includes('ExistentialDeposit')) {
        errorMessage = 'Transaction would drop account below existential deposit (1 LLD minimum).';
      } else if (error.message?.includes('InsufficientBalance')) {
        errorMessage = 'Insufficient balance to complete this transaction.';
      }

      api.error({
        message: 'Transaction Failed',
        description: errorMessage,
        duration: 6,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCallHash = (hash) => `${hash.slice(0, 8)}...${hash.slice(-4)}`;

  return (
    <Modal
      title={(
        <Flex align="center" gap={8}>
          <FileTextOutlined />
          <span>Pending Multisig Approvals</span>
          <Badge count={multisig.pendingTxs.length} color="orange" />
        </Flex>
      )}
      open
      onCancel={onClose}
      width={800}
      footer={null}
      closable={!isSubmitting}
      maskClosable={!isSubmitting}
    >
      {contextHolder}
      {multisig.pendingTxs.length === 0 ? (
        <Flex justify="center" align="center" style={{ padding: '40px 0' }}>
          <Text type="secondary">No pending transactions found</Text>
        </Flex>
      ) : (
        <Flex vertical gap={16}>
          <div>
            <Text strong style={{ marginBottom: 8, display: 'block' }}>
              Select Transaction (
              {multisig.pendingTxs.length}
              {' '}
              pending)
            </Text>
            <Select
              style={{ width: '100%' }}
              value={selectedTxHash}
              onChange={setSelectedTxHash}
              disabled={isSubmitting}
              options={multisig.pendingTxs.map((tx) => ({
                value: tx.callHash,
                label: (
                  <Flex align="center" gap={8}>
                    <Tag color="blue">Call</Tag>
                    <Text>{formatCallHash(tx.callHash)}</Text>
                  </Flex>
                ),
              }))}
            />
          </div>

          {selectedTx && (
            <>
              <Card>
                <Flex vertical gap={12}>
                  <Flex justify="space-between" align="center">
                    <Title level={5} style={{ margin: 0 }}>Transaction Details</Title>
                    <Tag color="blue">Multisig Call</Tag>
                  </Flex>

                  <Flex justify="space-between">
                    <Text type="secondary">Call Hash:</Text>
                    <CopyIconWithAddress address={selectedTx.callHash} />
                  </Flex>

                  <Flex justify="space-between">
                    <Text type="secondary">Depositor:</Text>
                    <CopyIconWithAddress address={selectedTx.multisig.depositor} />
                  </Flex>

                  <Flex justify="space-between">
                    <Text type="secondary">Block & Index:</Text>
                    <Text>
                      #
                      {selectedTx.multisig.when.height}
                      {' '}
                      /
                      {selectedTx.multisig.when.index}
                    </Text>
                  </Flex>

                  <div>
                    <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
                      Description:
                    </Text>
                    <Text>
                      Multisig transaction requiring
                      {' '}
                      {multisig.threshold}
                      {' '}
                      of
                      {' '}
                      {multisig.signatories.length}
                      {' '}
                      signatures
                    </Text>
                  </div>
                </Flex>
              </Card>

              <Card>
                <Flex vertical gap={12}>
                  <Flex justify="space-between" align="center">
                    <Title level={5} style={{ margin: 0 }}>Approval Status</Title>
                    <Space>
                      <Badge
                        count={selectedTx.multisig.approvals.length}
                        style={{ backgroundColor: '#52c41a' }}
                      />
                      <Text type="secondary">
                        of
                        {' '}
                        {multisig.threshold}
                        {' '}
                        required
                      </Text>
                    </Space>
                  </Flex>

                  {canExecute && (
                    <Alert
                      message="Ready to Execute"
                      description="This transaction has enough approvals and can be executed."
                      type="success"
                      showIcon
                    />
                  )}

                  {needsMoreApprovals && (
                    <Alert
                      message="Waiting for Approvals"
                      description={
                        `${multisig.threshold - selectedTx.multisig.approvals.length}
                        more approval
                        ${multisig.threshold - selectedTx.multisig.approvals.length > 1 ? 's' : ''}
                        needed.`
                      }
                      type="info"
                      showIcon
                    />
                  )}

                  <div>
                    <Text strong style={{ marginBottom: 8, display: 'block' }}>
                      Approved by:
                    </Text>
                    <Flex wrap gap={8}>
                      {selectedTx.multisig.approvals.map((address) => (
                        <Tooltip key={address} title={address}>
                          <Tag
                            color={address === userAddress ? 'blue' : 'green'}
                            icon={<UserOutlined />}
                          >
                            {address === userAddress ? 'You' : `${address.slice(0, 6)}...${address.slice(-4)}`}
                          </Tag>
                        </Tooltip>
                      ))}
                    </Flex>
                  </div>

                  <div>
                    <Text strong style={{ marginBottom: 8, display: 'block' }}>
                      Waiting for:
                    </Text>
                    <Flex wrap gap={8}>
                      {multisig.signatories
                        .filter((address) => !selectedTx.multisig.approvals.includes(address))
                        .map((address) => (
                          <Tooltip key={address} title={address}>
                            <Tag
                              color={address === userAddress ? 'orange' : 'default'}
                              icon={<ClockCircleOutlined />}
                            >
                              {address === userAddress ? 'You' : `${address.slice(0, 6)}...${address.slice(-4)}`}
                            </Tag>
                          </Tooltip>
                        ))}
                    </Flex>
                  </div>
                </Flex>
              </Card>

              {isUserSignatory && (
                <Card>
                  <Flex vertical gap={16}>
                    <Title level={5} style={{ margin: 0 }}>Your Action</Title>

                    <Flex vertical gap={12}>
                      {hasUserApproved && !isUserDepositor && (
                        <Alert
                          message="You have already approved this transaction"
                          type="success"
                          showIcon
                        />
                      )}
                      {hasUserApproved && isUserDepositor && (
                      <Alert
                        message="You have approved this transaction"
                        description="As the transaction creator, you can still reject it if needed."
                        type="success"
                        showIcon
                      />
                      )}

                      {(!hasUserApproved || isUserDepositor) && (
                        <Flex gap={16} align="end">
                          <div>
                            <Text strong style={{ display: 'block', marginBottom: 8 }}>
                              Action Type:
                            </Text>
                            <Select
                              style={{ width: 200 }}
                              value={actionType}
                              onChange={setActionType}
                              disabled={isSubmitting}
                              options={[
                                !hasUserApproved ? { value: 'approve', label: 'Approve Transaction' } : null,
                                isUserDepositor ? { value: 'reject', label: 'Reject Transaction' } : null,
                              ].filter(Boolean)}
                            />
                          </div>

                          {actionType === 'approve' && isFinalApproval && (
                            <Flex align="center" gap={8}>
                              <Text strong>Provide Call Data for final approval:</Text>
                              <Switch
                                checked={showCallData}
                                onChange={setShowCallData}
                                disabled={isSubmitting}
                              />
                            </Flex>
                          )}
                        </Flex>
                      )}

                      {actionType === 'approve' && isFinalApproval && showCallData && (
                        <Input
                          placeholder="Enter call data in hex format (0x...)"
                          value={callData}
                          onChange={(e) => setCallData(e.target.value)}
                          disabled={isSubmitting}
                        />
                      )}
                    </Flex>

                    {(!hasUserApproved || isUserDepositor) && (
                      <Flex gap={12} justify="end">
                        <Button onClick={onClose} disabled={isSubmitting}>
                          Cancel
                        </Button>
                        <Button
                          type={actionType === 'approve' ? 'submit' : 'secondary'}
                          loading={isSubmitting}
                          onClick={handleAction}
                          icon={actionType === 'approve' ? <CheckOutlined /> : <CloseOutlined />}
                        >
                          {actionType === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </Card>
              )}

              {!isUserSignatory && (
                <Alert
                  message="Observer Mode"
                  description="You are not a signatory of this multisig and cannot approve or reject transactions."
                  type="warning"
                  showIcon
                />
              )}
            </>
          )}
        </Flex>
      )}
    </Modal>
  );
}

MultisigApprove.propTypes = {
  multisig: PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired,
    signatories: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingTxs: PropTypes.arrayOf(PropTypes.shape({
      callHash: PropTypes.string.isRequired,
      multisig: PropTypes.shape({
        when: PropTypes.shape({
          height: PropTypes.number.isRequired,
          index: PropTypes.number.isRequired,
        }).isRequired,
        depositor: PropTypes.string.isRequired,
        approvals: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    })).isRequired,
  }).isRequired,
  userAddress: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onActionCompleted: PropTypes.func,
};

MultisigApprove.defaultProps = {
  onActionCompleted: () => {},
};

function ButtonModal(props) {
  return <OpenModalButton text="View Approvals" icon={<FileTextOutlined />} {...props} />;
}

ButtonModal.propTypes = {
  multisig: PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired,
    signatories: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingTxs: PropTypes.arrayOf(
      PropTypes.shape({
        callHash: PropTypes.string.isRequired,
        multisig: PropTypes.shape({
          when: PropTypes.shape({
            height: PropTypes.number.isRequired,
            index: PropTypes.number.isRequired,
          }).isRequired,
          depositor: PropTypes.string.isRequired,
          approvals: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

const MultisigApproveModal = modalWrapper(MultisigApprove, ButtonModal);

export default MultisigApproveModal;
