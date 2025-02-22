import React from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';

export function ProposalDiscussionFields() {
  return (
    <>
      <Form.Item name="discussionName" label="Discussion name" rules={[{ required: true }]}>
        <Input placeholder="Discussion name" />
      </Form.Item>
      <Form.Item name="discussionDescription" label="Discussion description" rules={[{ required: true }]}>
        <Input placeholder="Discussion description" />
      </Form.Item>
      <Form.Item name="discussionLink" label="Discussion link" rules={[{ required: true }]}>
        <Input placeholder="Discussion link" />
      </Form.Item>
    </>
  );
}
