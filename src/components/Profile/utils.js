import PropTypes from 'prop-types';

export const residentType = PropTypes.shape({
  givenName: PropTypes.string,
  familyName: PropTypes.string,
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
  birthdate: PropTypes.string,
  isCitizen: PropTypes.bool,
  companyUrl: PropTypes.bool,
});
