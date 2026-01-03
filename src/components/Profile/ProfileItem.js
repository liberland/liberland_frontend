import React from 'react';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Avatar from 'antd/es/avatar';
import Markdown from 'markdown-to-jsx';
import styles from './styles.module.scss';

function ProfileItem({
  isDataToShow,
  isMarkdown,
  isImage,
  title,
  dataFunction,
}) {
  const emptyElement = <em>&lt;empty&gt;</em>;
  const dataFromFunction = dataFunction();
  const yesOrNo = dataFromFunction ? 'Yes' : 'No';
  const htmlElement = isDataToShow
    ? dataFromFunction
    : yesOrNo;

  if (!htmlElement) {
    return (
      <List.Item>
        <List.Item.Meta title={title} description={emptyElement} />
      </List.Item>
    );
  }

  if (isMarkdown) {
    return (
      <List.Item>
        <List.Item.Meta
          title={title}
          description={htmlElement ? (
            <strong className={styles.formValue}>
              <Markdown options={{ disableParsingRawHTML: true }}>
                {htmlElement}
              </Markdown>
            </strong>
          ) : (
            emptyElement
          )}
        />
      </List.Item>
    );
  }

  if (isImage) {
    return (
      <List.Item>
        <List.Item.Meta
          title={title}
          description={<Avatar src={htmlElement} size={64} />}
        />
      </List.Item>
    );
  }

  return (
    <List.Item>
      <List.Item.Meta
        title={title}
        description={htmlElement ? (
          <strong className={styles.formValue}>
            {htmlElement}
          </strong>
        ) : (
          emptyElement
        )}
      />
    </List.Item>
  );
}

ProfileItem.propTypes = {
  isDataToShow: PropTypes.bool,
  isMarkdown: PropTypes.bool,
  isImage: PropTypes.bool,
  title: PropTypes.node,
  dataFunction: PropTypes.func,
};

export default ProfileItem;
