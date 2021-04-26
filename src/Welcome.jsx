import { useParams, useHistory } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

import Axios from "axios";

const Welcome = () => {
  const history = useHistory();

  if (Cookies.get("whyuser")) {
    history.push({ pathname: "/whyquestionnaire" });
  }
  const [name, setName] = useState(null);
  const addUser = () => {
    if (!name) {
      alert("Please enter your name first");
    } else {
      Cookies.set("whyusername", name);
      Axios.get(
        `https://whyquestionnaire.herokuapp.com/adduser?username=${name}`,
        { withCredentials: true }
      )
        .then((response) => {
          if (response.data.userid) {
            Cookies.set("whyuser", response.data.userid);
            history.push({ pathname: "/whyquestionnaire" });
          } else history.push({ pathname: "/welcome" });
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
