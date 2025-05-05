import React from 'react';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  button: {
    textTransform: 'none',
  },
});

const Button = ({ text, variant, color, onClick }) => {
  const classes = useStyles();

  return React.createElement(
    MuiButton,
    {
      variant,
      color,
      onClick,
      className: `${classes.button} px-4 py-2 rounded`,
    },
    text
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'default']),
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: 'contained',
  color: 'primary',
  onClick: () => {},
};

export default Button; 