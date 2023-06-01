import React from 'react';
import styles from './styles.module.scss';
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";
import {officesActions} from "../../../redux/actions";
import {TextInput} from "../../InputComponents";
import Button from "../../Button/Button";
import {setLandNFTMetadata} from "../../../api/nodeRpcCall";
function LandForm() {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
  } = useForm();

  const onSubmit = ({ sign_with_address, collection_id, nft_id, metadata_json }) => {
    /*metadata_json = {"demarcation": [
        {"lat":45.7723532,"long":18.8870918},{"lat":45.7721717,"long":18.8871917},
        {"lat":45.772333,"long":18.8877504},{"lat":45.7724976,"long":18.8876859},
        {"lat":45.7725234,"long":18.8876738},{"lat":45.7723532,"long":18.8870918}
      ],
      "type":"residential","status":"undeveloped"}*/
    metadata_json = JSON.parse(metadata_json)
    setLandNFTMetadata(collection_id,nft_id, metadata_json, sign_with_address)
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Set metadata for NFT</div>

      <TextInput
        register={register}
        name="sign_with_address"
        placeholder="Clerk Address to sign with"
        required
      />
      <TextInput
        register={register}
        name="collection_id"
        placeholder="Collection ID"
        required
      />
      <TextInput
        register={register}
        name="nft_id"
        placeholder="NFT ID"
        required
      />
      <TextInput
        register={register}
        name="metadata_json"
        placeholder="Metadata JSON"
        required
      />

      <div className={styles.buttonWrapper}>
        <Button
          primary
          medium
          type="submit"
        >
          Set Metadata
        </Button>
      </div>
    </form>
  );

  return (
    <div>
      LandRegistryOffice
    </div>
  )
}

function LandRegistry () {
  return (
    <LandForm />
  )
}

export default LandRegistry
