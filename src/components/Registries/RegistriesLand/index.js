import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Card from "../../Card";
import {blockchainSelectors, registriesSelectors} from "../../../redux/selectors";
import {registriesActions} from "../../../redux/actions";
import styles from './styles.module.scss';

const RegistriesLand = () => {
  const dispatch = useDispatch();
  const registries = useSelector(registriesSelectors.registries);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useEffect(() => {
    dispatch(registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress))
  }, [dispatch, registriesActions])
  return (
    <div>
      <Card title={"Land In Liberland"} key={"physicalLand"}>
        {registries?.officialUserRegistryEntries?.land.physical.map(land => {
          return (
            <Card title={land.id} key={`physicalLand${land.id}`} className={styles.landCard}>
              metadata: {land.data.data}
            </Card>
              )})}
      </Card>
      <Card title={"Land In Metaverse"} key={"metaverseLand"}>
        {registries?.officialUserRegistryEntries?.land.metaverse.map(land => {
          return (
            <Card title={land.id} key={`physicalLand${land.id}`} className={styles.metaverseLandCard}>
              metadata: {land.data.data}
            </Card>
          )})}
      </Card>
    </div>
  )
}

export default RegistriesLand
