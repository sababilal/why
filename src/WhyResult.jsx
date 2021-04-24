import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";
import { useState, useEffect } from "react";

const WhyResult = () => {
  const { value } = useParams();
  const history=useHistory();
  const retakeTest = () => {
    Axios.post("http://localhost:3003/deleteanswers")
      .then((response) => {
        if (response.data.deleted) {
          history.push({ pathname: "/whyquestionnaire" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-center col-md-7 alert alert-success mt-5 mx-auto">
          Your why is {value}
        </h1>
        <br />
        <button
          id="retaketestbtn"
          className="btn btn-lg btn-primary"
          onClick={retakeTest}
        >
          Retake Test
        </button>
      </div>
    </>
  );
};
export default WhyResult;
