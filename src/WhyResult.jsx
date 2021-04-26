import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";
import Cookies from "js-cookie";

const WhyResult = () => {
  const { value } = useParams();
  const history = useHistory();
  const retakeTest = () => {
  let userid=Cookies.get("whyuser");    

    Axios.post("https://whyquestionnaire.herokuapp.com/deleteanswers",  { userid: userid })
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
          {Cookies.get("whyusername").toUpperCase()}, Your why is {value}
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
