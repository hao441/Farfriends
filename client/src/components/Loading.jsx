import { useState } from "react";
import BarLoader from "react-spinners/BarLoader";

import './css/loading.css';

const override = {
    display: "block",
    margin: "auto",
    borderColor: "red",
    width: "300px"
  };


function Loading() {
  let [loading] = useState(true);

  return (
    <div className="background">
        <div className="loader-flex">
          <h1 id="vis-label">Farfriend is Loading</h1>
            <BarLoader
                color={"#ffffff"}
                loading={loading}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    </div>
  );
}

export default Loading;