import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./LinkButton.css";

export default ({
  text,
  className = "",
  disabled = false,
  link = "",
  ...props
}) =>
  <LinkContainer to={link}>
    <Button
      className={`LinkButton ${className}`}
      disabled={disabled}
      {...props}
    >
      {text}
    </Button>
  </LinkContainer>;
