import PropTypes from 'prop-types';

export default PropTypes.arrayOf(
  PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        )
      ])
    )
  )
);
