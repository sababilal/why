import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

function App() {
  const backButton = useRef(null);
  let history = useHistory();
  var [qIndex, setQindex] = useState();
  const [qtext, setQtext] = useState();
  const [option, setOptions] = useState([]);
  const [choosenOption, chooseOption] = useState("");
  console.log("qIndex is " + qIndex);

  useEffect(() => {
    Axios.post("http://localhost:3003/whyquestion")
      .then((response) => {
        if (response.data.whyresult) {
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

  // let msgbox = document.getElementById("msgbox");
  // msgbox.style.display = "none";
  // if (qid >= 27) {
  //   alertBox.current.innerText = " You are Inside the box";
  //   alertBox.current.style.display = "block";
  // } else if (qid < 27 && qid > 3) {
  //   alertBox.current.innerText = " You are Outside the box";
  //   alertBox.current.style.display = "block";
  // } else {
  //   alertBox.current.style.display = "none";
  // }
  // let backbtn = document.getElementById("backbtn");
  // backbtn.style.display = "flex";

  const nextQ = () => {
    document.getElementById("qform").reset();
    if (choosenOption.length == 0) {
      alert("Choose an option");
    } else {
      Axios.post("http://localhost:3003/saveanswer", {
        lockedanswer: choosenOption,
      })
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

    Axios.post("http://localhost:3003/deletelastanswer")
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

  return (
    <>
      <div className="row outblock">
        <div className="text-center alert alert-info mx-auto" id="msgbox"></div>
        <br />
        <div className="col-xl-4 col-lg-4 col-md-8 col-sm-10 col-12 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            id="qform"
            noValidate
          >
            <h3>
              <span>Q{qIndex} / </span>
              {qtext}
            </h3>
            <br />
            {option.map((val, idx) => {
              return (
                <>
                  <span>{idx + 1}&nbsp;&nbsp;</span>
                  <input
                    type="radio"
                    required
                    value={val.id}
                    name="option"
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
