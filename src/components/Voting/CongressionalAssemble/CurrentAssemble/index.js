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
    <Card title="">
      <div className={styles.currentAssembleHeader}>
        Acting Congressional Assembly
      </div>
      <div className={styles.congressMembersList}>
        {
            currentCongressMembers?.map((currentCongressMember) => <PoliticanCard politician={currentCongressMember} key={`current-congress-member${ currentCongressMember.name }`} />)
          }
      </div>
    </Card>
  </div>
);

export default CurrentAssemble;