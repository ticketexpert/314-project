import React from "react";
import "./EventSearch.css";

export default function EventSearch() {
  return (
    <div className="event-search-container">
      {/* Search Panel */}
      <div className="search-card">
        <h2>I will be in</h2>
        <input type="text" placeholder="Wollongong, NSW" />
        <input type="text" placeholder="Date" />
        <input type="text" placeholder="Find an artist, event name or venue" />
        <button className="search-button">Search</button>
      </div>

      {/* Event Card */}
      <div className="event-card">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Illawarra_Hawks.jpg/640px-Illawarra_Hawks.jpg"
          alt="Illawarra Hawks"
          className="event-img"
        />
        <div className="event-overlay">
          <div className="event-date">
            <span className="day">27</span>
            <span className="month">MAR</span>
          </div>
          <div className="event-info">
            <h3>Illawarra Hawks Celebrate with the City</h3>
            <p>Crown Street Mall, Wollongong</p>
          </div>
        </div>
      </div>
    </div>
  );
}
