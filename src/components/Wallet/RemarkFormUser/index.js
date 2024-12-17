import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../../InputComponents';
import styles from '../../Modals/styles.module.scss';
import { encodeRemark } from '../../../api/nodeRpcCall';

export default function RemarkFormUser({
  register,
  indexItem,
  errors,
  watch,
  setValue,
}) {
  const idName = indexItem !== null ? `id${indexItem}` : 'id';
  const descriptionName = indexItem !== null ? `description${indexItem}` : 'description';
  const combined = indexItem !== null ? `combined${indexItem}` : 'combined';

  const id = watch(idName);
  const description = watch(descriptionName);

  useEffect(() => {
    const remark = {
      id,
      description,
    };

    encodeRemark(remark).then((encoded) => setValue(combined, encoded, { shouldValidate: true }));
  }, [id, description, setValue, combined]);

  return (
    <>
      <div className={styles.title}>ID</div>
      <TextInput
        register={register}
        name={idName}
        errorTitle="ID"
        placeholder="Enter ID"
        required
      />
      {errors?.[`${idName}`] && (
        <div className={styles.error}>{errors?.[`${idName}`].message}</div>
      )}

      <div className={styles.title}>Description</div>
      <TextInput
        register={register}
        name={descriptionName}
        errorTitle="Description"
        placeholder="Enter Description"
        required
      />
      {errors?.[`${descriptionName}`] && (
        <div className={styles.error}>
          {errors[`${descriptionName}`].message}
        </div>
      )}

      <TextInput
        className={styles.displayNone}
        register={register}
        name={combined}
        validate={(value) => {
          if (Object.keys(value).length > 256) {
            return 'Remark should have less than 256 bytes';
          }
          return true;
        }}
      />
      {errors?.[`${combined}`] && (
        <div className={styles.error}>{errors[`${combined}`].message}</div>
      )}
    </>
  );
}

RemarkFormUser.defaultProps = {
  indexItem: null,
};

RemarkFormUser.propTypes = {
  register: PropTypes.func.isRequired,
  indexItem: PropTypes.number,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.any.isRequired,
};
