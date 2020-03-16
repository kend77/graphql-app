import React, { useState } from "react";
import useAsyncEffect from "./utils/useAsyncEffect";
import fetch from "./utils/fetch";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useAsyncEffect(async () => {
    const data = await fetch("/graphql");
    setMessage(data.message);
  }, [setMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {message}
        </a>
      </header>
    </div>
  );
}

export default App;
