// LIBS
import React, { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';
import { ReactComponent as DragAndDropImage } from '../../assets/icons/drag-and-drop.svg';
// import File from '../../utils/file';

const EditDraftModal = ({
  // eslint-disable-next-line react/prop-types
  onSubmit, closeModal, draft,
}) => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      // eslint-disable-next-line react/prop-types
      proposal_name: draft.proposalName,
      // eslint-disable-next-line react/prop-types
      short_description: draft.shortDescription,
      link_to_Google_document: '',
      // eslint-disable-next-line react/prop-types
      thread_link: draft.threadLink,
      file: '',
    },
  });

  const [isFileSelected, setIsFileSelected] = useState(false);

  // const toBase64 = (file) => new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = (error) => reject(error);
  // });

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      setValue('file', file);
      setIsFileSelected(true);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Edit Draft</div>
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
        {
          isFileSelected ? (
            <Controller
              render={({ field }) => (
                <div onClick={() => {
                  field.onChange('');
                  setIsFileSelected(false);
                }}
                >
                  {field.value.name}
                </div>
              )}
              name="file"
              control={control}
            />
          ) : (
            <>
              <DragAndDropImage />
              <span>
                Or drag and drop/browse to upload
              </span>
              <Controller
                render={({ field }) => (
                  <div {...getRootProps()} className={styles.dropZone}>
                    <input {...getInputProps({
                      onChange: async (e) => {
                        // const base64 = await File.toBase64(e.target.files[0]);
                        field.onChange(e.target.files[0]);
                        setIsFileSelected(true);
                      },
                    })}
                    />
                  </div>
                )}
                name="file"
                control={control}
              />
            </>
          )
        }

      </div>
      <div className={styles.title}>Thread link</div>
      <TextInput
        register={register}
        name="thread_link"
        placeholder="https://"
      />
      <div className={styles.buttonWrapper}>
        <Button
          primary
          large
          type="submit"
        >
          Save draft
        </Button>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          medium
          type="submit"
        >
          Delete
        </Button>
      </div>
    </form>
  );
};

const EditDraftModalWrapper = (props) => (
  <ModalRoot>
    <EditDraftModal {...props} />
  </ModalRoot>
);

export default EditDraftModalWrapper;
