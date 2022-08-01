import React, {useMemo, useState} from 'react';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../../redux/selectors';
import ProposalItem from "./Items/ProposalItem";
import Card from "../../Card";
import styles from './styles.module.scss';
import ReferendumItem from "./Items/ReferendumItem";
import {VoteOnReferendumModal} from "../../Modals";
import {useForm} from "react-hook-form";
import DispatchItem from "./Items/DispatchItem";

const Referendum = () => {
  const userId = useSelector(userSelectors.selectUserId);
  const [isModalOpenVote, setIsModalOpenVote] = useState(false);
  const [modalShown, setModalShown] = useState(1);
  const [selectedReferendumInfo, setSelectedReferendumInfo] = useState({ name: 'Referendum' });
  const [selectedVoteType, setSelectedVoteType] = useState('Nay');
  const { handleSubmit, register } = useForm();
  const handleModalOpenVote = (voteType, referendumInfo) => {
    setIsModalOpenVote(!isModalOpenVote);
    setSelectedReferendumInfo(referendumInfo);
    setSelectedVoteType(voteType);
    setModalShown(1);
  };
  const handleModalOpenEndorse = (referendumInfo) => {
    setIsModalOpenVote(!isModalOpenVote);
    setSelectedReferendumInfo(referendumInfo);
    setModalShown(2);
  };
  return (
    <div>
      <div className={styles.referendumsSection}>
        <Card title="Referendums" className={styles.referendumsCard}>
          <div>
            <ReferendumItem
              name="Invisible hand Bill"
              createdBy="Joe Rogan"
              currentEndorsement="25k LLD"
              externalLink="https://forum.liberland.org/"
              description="We want the invisible hand of the free market to do its thing, we unshackle it to allow freer commerce. Have you tried DMT?"
              yayVotes={246500}
              nayVotes={43800}
              hash="0x5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR"
              alreadyVoted={false}
              buttonVoteCallback={handleModalOpenVote}
              votingTimeLeft="2d 3h 47m"
            />
            <ReferendumItem
              name="Kill puppies act"
              createdBy="Shillary Killton"
              currentEndorsement="25M LLD"
              externalLink="https://forum.liberland.org/"
              description="To help mitigate climate change and citizens having too much power and autonomy over their daily lives, all puppies should be killed. Additionally, we need a new tax to fund the dogcentration camps."
              userDidEndorse={false}
              yayVotes={8350}
              nayVotes={37500}
              hash="0x5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR"
              alreadyVoted="Nay"
              buttonVoteCallback={handleModalOpenVote}
              votingTimeLeft="14d 21h 02m"
            />
          </div>
        </Card>
      </div>
      <div className={styles.referendumsSection}>
        <Card title="Proposals">
          <div>
            <ProposalItem
              name="Introduce wild lobsters to danube"
              createdBy="Jordan Peterson"
              currentEndorsement="137.5k LLD"
              externalLink="https://forum.liberland.org/"
              description="Lobsters psychologically are very similar to humans therefore they should be allowed to experience Liberland when we reintroduce them to the Danube "
              userDidEndorse={true}
              hash="0x5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR"
              buttonEndorseCallback={handleModalOpenEndorse}
            />
            <ProposalItem
              name="Bomb Syria"
              createdBy="Alex Jones"
              currentEndorsement="41.7k LLD"
              externalLink="https://forum.liberland.org/"
              description="All the cool nations are doing it. We will never be respected as a real country until we bomb syria"
              userDidEndorse={false}
              hash="0x5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR"
              buttonEndorseCallback={handleModalOpenEndorse}
            />
          </div>
        </Card>
      </div>
      <div className={styles.referendumsSection}>
        <Card title="Dispatches">
          <div>
            <DispatchItem
              name="Establish secret service"
              createdBy="The invisible hand"
              externalLink="https://forum.liberland.org/"
              yayVotes={37500}
              nayVotes={8350}
              hash="0x5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR"
              description="A secret service, funded by donations, called The invisible hand will be established"
              timeLeftUntilImplemented="14d 21h 02m"
            />
            <DispatchItem
              name="Enable fertility tourism"
              createdBy="Zelensky"
              externalLink="https://forum.liberland.org/"
              yayVotes={74500}
              nayVotes={31250}
              hash="0x5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR"
              description="Liberlands constitution forbids slavery but the wording also forbids fertility tourism. Amend the constitution to allow for such contracts"
              timeLeftUntilImplemented="30d 04h 51m"
            />
          </div>
          {isModalOpenVote && (
            <VoteOnReferendumModal
              closeModal={handleModalOpenVote}
              handleSubmit={handleSubmit}
              register={register}
              modalShown={modalShown}
              setModalShown={setModalShown}
              referendumInfo={selectedReferendumInfo}
              voteType={selectedVoteType}
              onSubmit={() => {}}
            />
          )}
        </Card>
      </div>
    </div>
  )
}
export default Referendum;
