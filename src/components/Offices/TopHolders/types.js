import PropTypes from 'prop-types';

export const holder = PropTypes.shape({
  address: PropTypes.node.isRequired,
  display: PropTypes.node.isRequired,
  total_lld_balance: PropTypes.node.isRequired,
  liquid_lld_balance: PropTypes.node.isRequired,
  frozen_lld_balance: PropTypes.node.isRequired,
  reserved_lld_balance: PropTypes.node.isRequired,
  staked_llm_balance: PropTypes.node.isRequired,
  liquid_llm_balance: PropTypes.node.isRequired,
  is_citizen: PropTypes.node.isRequired,
  is_eresident: PropTypes.node.isRequired,
  identity: PropTypes.node.isRequired,
});
