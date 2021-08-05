// LIBS
import React from 'react';
import useForm from 'react-hook-form';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';
import { ReactComponent as DragAndDropImage } from '../../assets/icons/drag-and-drop.svg';

const AddNewDraftModal = ({
  // eslint-disable-next-line react/prop-types
  onSubmit, closeModal,
}) => {
  const {
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      amount: '10',
      account_from: '5FLSigC9HGRKVhB9FiEo4Ydsdgsdg',
      // Default address to send is CHARLIE
      account_to: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    },
  });

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Add New Draft</div>
      <div className={styles.title}>Proposal name</div>
      <TextInput
        register={register}
        name="proposal_name"
        placeholder="E.g. Change lorem ipsum dolor sit amet"
        required
      />
      <div className={styles.title}>Short description</div>
      <TextInput
        register={register}
        name="short_description"
        placeholder="E.g. Lorem ipsum dolor sit amet"
        required
      />
      <div className={styles.title}>Link to Google Document</div>
      <TextInput
        register={register}
        name="link_to_Google_document"
        placeholder="https://"
      />
      <div className={styles.dragAndDrop}>
        <DragAndDropImage />
        <span>
          Or drag and drop/browse to upload
        </span>
      </div>
      <div className={styles.title}>Thread link</div>
      <TextInput
        register={register}
        name="thread_link"
        placeholder="https://"
      />
      <div className={styles.buttonWrapper}>
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Save draft
        </Button>
      </div>
    </form>
  );
};

const AddNewDraftModalWrapper = (props) => (
  <ModalRoot>
    <AddNewDraftModal {...props} />
  </ModalRoot>
);

export default AddNewDraftModalWrapper;
