import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import PoliticanCard from "../PoliticianCard/Index";
import Card from "../../../Card";

const CurrentAssemble = (
  {
    currentCongressMembers,
  },
) => (
  <div>
    <Card>
      <div className={styles.currentAssembleHeader}>
        Acting Congressional Assembly
      </div>
      <div className={styles.congressMembersList}>
        {
            currentCongressMembers?.map((currentCongressMember) => <PoliticanCard politician={currentCongressMember} />)
          }
      </div>
    </Card>
  </div>
);

export default CurrentAssemble;
