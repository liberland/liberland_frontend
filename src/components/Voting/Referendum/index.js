import React, { useMemo, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useForm } from 'react-hook-form';
import {blockchainSelectors, democracySelectors, userSelectors} from '../../../redux/selectors';
import ProposalItem from './Items/ProposalItem';
import Card from '../../Card';
import styles from './styles.module.scss';
import ReferendumItem from './Items/ReferendumItem';
import { VoteOnReferendumModal } from '../../Modals';
import DispatchItem from './Items/DispatchItem';
import {formatDemocracyMerits, formatMerits} from "../../../utils/walletHelpers";
import {democracyActions, walletActions} from "../../../redux/actions";

const Referendum = () => {
  const userId = useSelector(userSelectors.selectUserId);
  const [isModalOpenVote, setIsModalOpenVote] = useState(false);
  const [modalShown, setModalShown] = useState(1);
  const [selectedReferendumInfo, setSelectedReferendumInfo] = useState({ name: 'Referendum' });
  const [selectedVoteType, setSelectedVoteType] = useState('Nay');
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  console.log('democracy')
  console.log(democracy)
  console.log('userWalletAddress')
  console.log(userWalletAddress)

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
  const handleSubmitSecondForm = (values) => {
    console.log(values)
    dispatch(democracyActions.secondProposal.call(values));
  }
  const handleSubmitVoteForm = (values) => {
    dispatch(democracyActions.voteOnReferendum.call({...values, voteType: selectedVoteType}));
  }
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
              referendumIndex={1}
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
              referendumIndex={2}
            />
            {
              democracy.democracy?.apideriveReferendums.map((referendum) => (
                <ReferendumItem
                  name="Onchain referendum"
                  createdBy="There is no createdBy unless thru database"
                  currentEndorsement="??"
                  externalLink="https://forum.liberland.org/"
                  description="OnchainReferendum"
                  yayVotes={referendum.votedAye}
                  nayVotes={referendum.votedNay}
                  //nayVotes={formatDemocracyMerits(parseInt(referendum.votedNay.words[0]))}
                  hash={referendum.imageHash}
                  alreadyVoted={
                    (referendum.allAye.reduce((previousValue, currentValue) => {
                      if(currentValue.accountId == userWalletAddress){
                        return previousValue + 1;
                      }
                      else return previousValue;
                    }, 0)  > 0 ) ? 'Aye'
                      : (referendum.allNay.reduce((previousValue, currentValue) => {
                      if(currentValue.accountId == userWalletAddress){
                        return previousValue + 1;
                      }
                      else return previousValue;
                    }, 0)  > 0 ) ? 'Nay' : false
                  }
                  /*alreadyVoted={referendum.allAye.includes(userWalletAddress) ? 'Aye'
                    : referendum.allNay.includes(userWalletAddress) ? 'Nay' : false}*/
                  buttonVoteCallback={handleModalOpenVote}
                  votingTimeLeft="Query system or something for this"
                  referendumIndex={parseInt(referendum.index)}
                />
              ))
            }
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
              userDidEndorse
              hash="0x5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR"
              buttonEndorseCallback={handleModalOpenEndorse}
              proposalIndex={1}
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
              proposalIndex={2}
            />
            {
              democracy.democracy?.proposalsDerive.map((proposal) => {
                console.log("proposal.seconds.includes(userWalletAddress)")
                console.log(proposal.seconds.includes(userWalletAddress))
                console.log(proposal.seconds)
                console.log(proposal.proposer)
                console.log(userWalletAddress)
                return (<ProposalItem
                  name="Onchain proposal"
                  createdBy={proposal.proposer}
                  currentEndorsement={`${proposal.seconds.length} Citizens supported`}
                  externalLink="https://forum.liberland.org/"
                  description="OnChain proposal"
                  userDidEndorse={(proposal.seconds.includes(userWalletAddress) || proposal.proposer === userWalletAddress)}
                  hash={proposal.imageHash}
                  buttonEndorseCallback={handleModalOpenEndorse}
                  proposalIndex={proposal.index}
                />)
              })
            }
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
              onSubmitSecond={handleSubmitSecondForm}
              onSubmitVote={handleSubmitVoteForm}
            />
          )}
        </Card>
      </div>
    </div>
  );
};
export default Referendum;
