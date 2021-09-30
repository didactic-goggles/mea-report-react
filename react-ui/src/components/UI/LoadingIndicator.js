import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingIndicator = () => {
  return (
    <div
      className="d-flex align-items-center w-100 justify-content-center mt-auto"
      style={{ height: "100%" }}
    >
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <h3 className="ml-2">Yükleniyor</h3>
    </div>
  );
}

export default LoadingIndicator;
