import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { congressActions, financesActions } from '../redux/actions';
import {
  blockchainSelectors, congressSelectors, democracySelectors, financesSelectors,
} from '../redux/selectors';
import {
  formatPercent, readFigures, readScheduledCalls, readSpending,
} from '../utils/republicLive';

/*
 * The three live readings the landing screen shows beside the citizen's own
 * tasks: what the state is about to do, where its money went, and how the
 * republic is doing.
 *
 * The scheduler agenda costs nothing extra — it already arrives with the
 * referendum data the task panel asks for. The other two are a single HTTP
 * call each to the statistics service, not the chain.
 */

/**
 * Whether a request has finished, whichever way it went.
 *
 * Without this a failed fetch is indistinguishable from one still in flight,
 * and the panel sits there saying "reading…" forever about something that
 * will never arrive. A reader deserves to be told the difference.
 */
function useSettled(isLoading) {
  const [settled, setSettled] = useState(false);
  const wasLoading = useRef(false);

  useEffect(() => {
    if (wasLoading.current && !isLoading) setSettled(true);
    wasLoading.current = Boolean(isLoading);
  }, [isLoading]);

  return settled;
}

export default function useRepublicLive() {
  const dispatch = useDispatch();
  const currentBlock = useSelector(blockchainSelectors.blockNumber);
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const democracyLoading = useSelector(democracySelectors.selectorGettingDemocracyInfo);
  const spending = useSelector(congressSelectors.spendingSelector);
  const spendingLoading = useSelector(congressSelectors.isLoading);
  const finances = useSelector(financesSelectors.selectorFinances);
  const financesLoading = useSelector(financesSelectors.selectorIsLoading);

  useEffect(() => {
    dispatch(financesActions.getFinances.call());
    dispatch(congressActions.congressSpending.call());
  }, [dispatch]);

  const democracySettled = useSettled(democracyLoading);
  const spendingSettled = useSettled(spendingLoading);
  const financesSettled = useSettled(financesLoading);

  const scheduled = useMemo(
    () => readScheduledCalls(democracy?.democracy?.scheduledCalls, currentBlock),
    [democracy, currentBlock],
  );
  const payments = useMemo(() => readSpending(spending), [spending]);
  const figures = useMemo(() => readFigures(finances), [finances]);

  return {
    scheduled,
    payments,
    figures,
    // The summary strip and the Ledger's cards ask for single figures.
    stakerApy: formatPercent(finances?.stakerApyWeeklyPayouts),
    openReferenda: democracy?.democracy?.crossReferencedReferendumsData?.length ?? null,
    // Three answers each block can give: here it is, there is none, or we
    // asked and got nothing back.
    hasAgenda: Boolean(democracy?.democracy),
    hasSpending: Boolean(spending),
    hasFigures: Boolean(finances),
    agendaFailed: democracySettled && !democracy?.democracy,
    spendingFailed: spendingSettled && !spending,
    figuresFailed: financesSettled && !finances,
  };
}
