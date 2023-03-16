import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {blockchainSelectors, registriesSelectors} from "../../../redux/selectors";
import {registriesActions} from "../../../redux/actions";
import Card from "../../Card";

const RegistriesOverview = () => {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  useEffect(() => {
    dispatch(registriesActions.getOfficialUserRegistryEntries.call(userWalletAddress))
  }, [dispatch, registriesActions])
  const registries = useSelector(registriesSelectors.registries);
  console.log(registries)
  return (
    <div>
      <Card title={"Companies"} key={"Companies"}>
        <div>You have :
          <ul>
            <li>{registries?.officialUserRegistryEntries?.companies?.registered?.length} Registered companies</li>
            <li>{registries?.officialUserRegistryEntries?.companies?.requested?.length} Requested companies</li>
            <li>X plots of Physical Land</li>
            <li>X plots of metaverse land</li>
            <li>X Assets</li>
            <li>X other NFTs</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

export default RegistriesOverview
