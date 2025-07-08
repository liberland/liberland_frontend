/* eslint-disable no-console */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Modal from 'antd/es/modal';
import Input from 'antd/es/input';
import InputNumber from 'antd/es/input-number';
import Upload from 'antd/es/upload';
import Switch from 'antd/es/switch';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Typography from 'antd/es/typography';
import Alert from 'antd/es/alert';
import Tag from 'antd/es/tag';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import { blockchainSelectors } from '../../redux/selectors';
import CopyIconWithAddress from '../CopyIconWithAddress';
import modalWrapper from '../Modals/components/ModalWrapper';
import OpenModalButton from '../Modals/components/OpenModalButton';
import { createMultisigData } from '../../utils/multisig';
import { isValidSubstrateAddress } from '../../utils/walletHelpers';

const { Text } = Typography;

const MAX_SIGNATORIES = 100;
const MIN_THRESHOLD = 2;

function createMultisig(signatories, threshold, name, onStatusChange = () => {}) {
  const multisigData = createMultisigData({
    signatories,
    threshold,
    name,
  });

  const status = {
    action: 'create',
    status: 'success',
    message: 'Multisig created successfully',
    account: multisigData.address,
  };

  if (onStatusChange) {
    onStatusChange(status);
  }

  return status;
}

function MultisigForm({ onClose, onStatusChange, onMultisigCreated }) {
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  const [form] = Form.useForm();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedSignatories, setUploadedSignatories] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [signatories, setSignatories] = useState([]);
  const [threshold, setThreshold] = useState(MIN_THRESHOLD);
  const [inputValue, setInputValue] = useState('');

  const handleFileUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data) || !data.length) {
          throw new Error('JSON file should contain an array of signatories');
        }

        // Basic address validation
        const validAddresses = data.filter((item) => typeof item === 'string' && item.length > 10);
        const uniqueAddresses = [...new Set(validAddresses)];

        if (uniqueAddresses.length > MAX_SIGNATORIES) {
          throw new Error(`Maximum ${MAX_SIGNATORIES} signatories allowed`);
        }

        setUploadedSignatories(uniqueAddresses);
        setSignatories(uniqueAddresses);
        setUploadError('');
      } catch (error) {
        setUploadError(error.message || 'Failed to parse file');
        setUploadedSignatories([]);
      }
    };
    reader.readAsText(file);
    return false; // Prevent default upload behavior
  }, []);

  const handleAddSignatory = useCallback((address) => {
    address = address.trim();
    if (!isValidSubstrateAddress(address)) return;
    if (address && !signatories.includes(address)) {
      const newSignatories = [...signatories, address];
      setSignatories(newSignatories);
      if (threshold > newSignatories.length) {
        setThreshold(Math.min(threshold, newSignatories.length));
      }
      setInputValue('');
    }
  }, [signatories, threshold]);

  const handleRemoveSignatory = useCallback((index) => {
    const newSignatories = signatories.filter((_, i) => i !== index);
    setSignatories(newSignatories);
    if (threshold > newSignatories.length) {
      setThreshold(Math.max(MIN_THRESHOLD, newSignatories.length));
    }
  }, [signatories, threshold]);

  const handleCreateMultisig = useCallback((values) => {
    const { name } = values;

    createMultisig(signatories, threshold, name.trim(), onStatusChange);
    onMultisigCreated();
    onClose();
  }, [signatories, threshold, onStatusChange, onMultisigCreated, onClose]);

  const resetFileUpload = useCallback(() => {
    setUploadedSignatories([]);
    setUploadError('');
  }, []);

  const isValid = signatories.length >= 2
    && threshold >= MIN_THRESHOLD
    && threshold <= signatories.length;

  return (
    <Modal
      title="Create Multisig Account"
      open
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateMultisig}
      >
        <Alert
          message="About Multisig Accounts"
          // eslint-disable-next-line max-len
          description="Multisig accounts require multiple signatures to authorize transactions. Once created, they function like any other account and need to be funded before use."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form.Item>
          <Flex justify="space-between" align="center">
            <Text strong>Upload signatories from JSON file</Text>
            <Switch
              checked={showFileUpload}
              onChange={setShowFileUpload}
            />
          </Flex>
        </Form.Item>

        {showFileUpload ? (
          <>
            <Form.Item
              label="Upload JSON file with signatories"
              help="Supply a JSON file with an array of signatory addresses"
            >
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept=".json"
              >
                <Button icon={<UploadOutlined />}>Upload JSON file</Button>
              </Upload>
              {uploadError && (
                <Alert
                  message={uploadError}
                  type="error"
                  style={{ marginTop: 8 }}
                />
              )}
            </Form.Item>

            {uploadedSignatories.length > 0 && (
              <Form.Item label="Uploaded Signatories">
                <List
                  dataSource={uploadedSignatories}
                  renderItem={(address, index) => (
                    <List.Item
                      actions={[
                        <Button
                          key="remove"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveSignatory(index)}
                        >
                          Remove
                        </Button>,
                      ]}
                    >
                      <CopyIconWithAddress address={address} />
                    </List.Item>
                  )}
                />
                <Button onClick={resetFileUpload} style={{ marginTop: 8 }}>
                  Reset Upload
                </Button>
              </Form.Item>
            )}
          </>
        ) : (
          <>
            <Form.Item
              label="Add Signatories"
              help="Add addresses that will be able to sign transactions for this multisig account"
            >
              <Flex vertical gap={8}>
                <InputSearch
                  placeholder="Enter or search for signatory address"
                  value={inputValue}
                  onChange={setInputValue}
                  onSelect={(address) => {
                    handleAddSignatory(address);
                    setInputValue('');
                  }}
                  onInputKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      handleAddSignatory(inputValue);
                    }
                  }}
                />
                {userWalletAddress && (
                  <Button
                    size="small"
                    onClick={() => handleAddSignatory(userWalletAddress)}
                  >
                    Add my address
                  </Button>
                )}
              </Flex>
            </Form.Item>

            {signatories.length > 0 && (
              <Form.Item label="Selected Signatories">
                <Flex wrap gap={8}>
                  {signatories.map((address, index) => (
                    <Tag
                      key={address}
                      closable
                      onClose={() => handleRemoveSignatory(index)}
                    >
                      {address.slice(0, 8)}
                      ...
                      {address.slice(-8)}
                    </Tag>
                  ))}
                </Flex>
              </Form.Item>
            )}
          </>
        )}

        <Form.Item
          label="Threshold"
          help={`Minimum number of signatures required to execute transactions (max: ${signatories.length})`}
        >
          <InputNumber
            min={MIN_THRESHOLD}
            max={Math.max(MIN_THRESHOLD, signatories.length)}
            value={threshold}
            onChange={setThreshold}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Multisig Name"
          rules={[
            { required: true, message: 'Please enter a name for the multisig' },
            { min: 3, message: 'Name must be at least 3 characters' },
          ]}
        >
          <Input placeholder="Enter a name for this multisig account" />
        </Form.Item>

        <Form.Item>
          <Flex gap={16} justify="end">
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              primary
              disabled={!isValid}
            >
              Create Multisig
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
}

MultisigForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func,
  onMultisigCreated: PropTypes.func,
};

function ButtonModal(props) {
  return <OpenModalButton text="Create Multisig" primary {...props} />;
}

ButtonModal.propTypes = {
  onMultisigCreated: PropTypes.func,
};

const CreateMultisigModal = modalWrapper(MultisigForm, ButtonModal);

export default CreateMultisigModal;
