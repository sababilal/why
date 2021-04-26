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
  let userid=Cookies.get("whyuser");    
    Axios.post("https://whyquestionnaire.herokuapp.com/whyquestion", { userid: userid })
      .then((response) => {
        if (response.data === false) {
          history.push({ pathname: "/welcome" });
        } else if (response.data.whyresult) {
          let resultPath = "/whyresult/" + response.data.whyresult;
          history.push({ pathname: resultPath });
        } else {
          setQindex(response.data[2]);
          setQtext(response.data[0].question);
          setOptions([...response.data[1]]);
        }
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
  let userid=Cookies.get("whyuser");    

    document.getElementById("qform").reset();
    if (choosenOption.length == 0) {
      alert("Choose an option");
    } else {
      Axios.post(
        "https://whyquestionnaire.herokuapp.com/saveanswer",
        {
          lockedanswer: choosenOption,
        },
         { userid: userid }
      )
        .then((response) => {
          setQindex("");
          chooseOption("");
          if (response.data.saved) {
            history.push({ pathname: "/whyquestionnaire" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const goBack = () => {
    document.getElementById("qform").reset();
    let userid=Cookies.get("whyuser");    

    Axios.post("https://whyquestionnaire.herokuapp.com/deletelastanswer",  { userid: userid })
      .then((response) => {
        if (response.data.deleted) {
          setQindex("");
          chooseOption("");
          history.push({ pathname: "/whyquestionnaire" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
if(!qIndex)
  return (
  <>
<h1>Loading.....</h1>
  </>);
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
              <span id="qtext" >Q{qIndex} / </span>
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
