import { useHistory } from "react-router-dom";
import React, { useState} from "react";
import Cookies from "js-cookie";
import Axios from "axios";

const Welcome = () => {
  const history = useHistory();
  //Check if a cookie is already created.  If it is return to whyquestionnaire
  if (Cookies.get("whyuser")) {
    history.push({ pathname: "/whyquestionnaire" });
  }
  //Store the name entered by user in the useState
  const [name, setName] = useState(null);


  const addUser = () => {
    //Check if the user doesn't enter name.
    if (!name) {
      alert("Please enter your name first");
    } else {
      //If the user sets the name, create a cookie with his name
      Cookies.set("whyusername", name,{expires:1/24});

      //send a request to api to  add this user into the database
      Axios.post(
        `https://whyquestionnaire.herokuapp.com/adduser?username=${name}`,
      )
        .then((response) => {

          if (response.data.userid) {
            //store the userid received in a cookie.
            Cookies.set("whyuser", response.data.userid,{expires:1/24});
            history.push({ pathname: "/whyquestionnaire" });
          } else
           history.push({ pathname: "/welcome" });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="row text-center mt-5">
        <form
          className="col-md-4 col-10 mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label for="inputEmail4" className="form-label">
            Enter your name
          </label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <button type="submit" className="btn btn-success" onClick={addUser}>
            Find my WHY
          </button>
        </form>
      </div>
    </>
  );
};
export default Welcome;
