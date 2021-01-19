import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "rsuite";
import { FaChevronLeft } from "react-icons/fa";
const BackButton = () => {
  let history = useHistory();
  return (
    <div className="row mb-3">
      <div className="col-12">
        <Button
          appearance="subtle"
          onClick={() => history.goBack()}
          className="d-flex align-items-center"
        >
          <FaChevronLeft />
          <span className="ml-1 font-size-lg">Geri</span>
        </Button>
      </div>
    </div>
  );
};

export default BackButton;
