import React from 'react';
import PropTypes from 'prop-types';

function ExistingMotionsAndReferendums({ motion, referendum, proposal }) {
  if (!motion && !referendum && !proposal) {
    return null;
  }

  return (
    <>
      {motion && (
        <p>
          Repeal motion:
          <a href={`/home/congress/motions#${motion}`}>{motion}</a>
        </p>
      )}
      {referendum && (
        <p>
          Repeal referendum:
          <a href={`/home/voting/referendum#${referendum}`}>{referendum}</a>
        </p>
      )}
      {proposal && (
        <p>
          Repeal proposal:
          <a href={`/home/voting/referendum#${proposal}`}>{proposal}</a>
        </p>
      )}
    </>
  );
}

ExistingMotionsAndReferendums.propTypes = {
  motion: PropTypes.string.isRequired,
  referendum: PropTypes.string.isRequired,
  proposal: PropTypes.string.isRequired,
};

export default ExistingMotionsAndReferendums;
