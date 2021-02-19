import React from "react";
import { Container, Spinner } from "react-bootstrap";

export const Loader = () => {
  return (
    <Container className="d-flex justify-content-center mt-4">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  );
};
