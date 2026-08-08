import React from "react";
import Popup from "react-popup";
import "react-popup/style.css";
import "./../styles/App.css";
import EventTracker from "./EventTracker";

const App = () => {
  return (
    <div>
      {/* Do not remove the main div */}
      <EventTracker />
      <Popup />
    </div>
  );
};

export default App;
