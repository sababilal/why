  import React, { useState, useEffect, useRef } from "react";
  import Axios from "axios";
  import { useHistory } from "react-router-dom";
  import Cookies from "js-cookie";

  function App() {
    const backButton = useRef(null);
    let history = useHistory();
    var [qIndex, setQindex] = useState();
    const [qtext, setQtext] = useState();
    const [option, setOptions] = useState([]);
    const [choosenOption, chooseOption] = useState("");

    useEffect(() => {
      //get the userid from the cookie stored and send it to /whyquestion api for getting the appropriate question for this user
      let userid = Cookies.get("whyuser");
      Axios.post("https://whyquestionnaire.herokuapp.com/whyquestion", {
        userid: userid,
      })
        .then((response) => {
          // if a cookie doesn't exist redirect the user to welcome page where he can give his name
          if (response.data === false) {
            history.push({ pathname: "/welcome" });
             // if a result is received, send user to result page
          } else if (response.data.whyresult) {
            let resultPath = "/whyresult/" + response.data.whyresult;
            history.push({ pathname: resultPath });
          } else {
            // if question is receieved, save the data in appropriate useStates
            setQindex(response.data[2]);
            setQtext(response.data[0].question);
            setOptions([...response.data[1]]);
          }
          //hide back button if the question asked is the first question
          if (qIndex === 1) {
            backButton.current.style.display = "none";
          } else {
            backButton.current.style.display = "inline-block";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, [qIndex]);


    const nextQ = () => {
      //for saving the given option get the userid from cookie
      let userid = Cookies.get("whyuser");
      document.getElementById("qform").reset();
      //check if option is choosen
      if (choosenOption.length == 0) {
        alert("Choose an option");
      } else {
        //send the userid and the option selected to /saveanswer api where the option will be saved
        Axios.post("https://whyquestionnaire.herokuapp.com/saveanswer", {
          lockedanswer: choosenOption,
          userid: userid,
        })
          .then((response) => {
            //when response receieved is true set the useState Qindex to empty so that the components can refresh with the useEffect 
            //and redirect the user to /whyquestionnaire so that he sees the next question
            if (response.data.saved) {
                setQindex("");
                chooseOption("");
                history.push({ pathname: "/whyquestionnaire" });
              }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    const goBack = () => {
      //if the user wants to go back to the last question get the userid from cookie and send to /deletelastanswer api
      let userid = Cookies.get("whyuser");
      document.getElementById("qform").reset();
      Axios.post("https://whyquestionnaire.herokuapp.com/deletelastanswer", {
        userid: userid,
      })
        .then((response) => {
          if (response.data.deleted) {
            //when the last answer is deleted set the useStates to empty so that components  refresh with the useEffect 
            //and redirect the user to /whyquestionnaire so that he sees the last question
            setQindex("");
            chooseOption("");
            history.push({ pathname: "/whyquestionnaire" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
//if qIndex has not been set, return a message which displays Loading.....
    if (!qIndex)
      return (
        <>
          <h1>Loading.....</h1>
        </>
      );
      //if qIndex has been set, return the question and options
    else
      return (
        <>
          <div className="row outblock">
            <div className="quesbox col-xl-4 col-lg-4 col-md-8 col-sm-12 col-12">
              <br />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                id="qform"
                noValidate
              >
                <h3 id="qtext">
                  <span id="qtext">Q{qIndex} / </span>
                  {qtext}
                </h3>
                <br />
                {option.map((val, idx) => {
                  return (
                    <>
                      <span className="radiobtn">{idx + 1}&nbsp;&nbsp;</span>
                      <input
                        type="radio"
                        required
                        value={val.id}
                        name="option"
                        className="radiobtn"
                        onClick={(e) => {
                          chooseOption(e.target.value);
                        }}
                      />
                      <label>&nbsp;{val.option}</label>
                      <br />
                    </>
                  );
                })}
                <br />
                <br />
               
                <button
                  id="backbtn"
                  ref={backButton}
                  className="btn  btn-warning me-3"
                  onClick={goBack}
                >
                  Go Back
                </button>

                <button className="btn  btn-success" onClick={nextQ}>
                  Save and Next
                </button>
              </form>
            </div>
          </div>
        </>
      );
  }

  export default App;
