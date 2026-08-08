import React, { useState } from "react";
import moment from "moment";
import Calendar from "react-big-calendar";
import Popup from "react-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = Calendar.momentLocalizer(moment);

const PAST_COLOR = "rgb(222, 105, 135)";
const UPCOMING_COLOR = "rgb(140, 189, 76)";

const isPastEvent = (event) => moment(event.start).isBefore(moment(), "day");

const EventForm = ({ formData }) => (
  <div className="event-form">
    <input
      type="text"
      placeholder="Event Title"
      defaultValue={formData.title}
      onChange={(e) => {
        formData.title = e.target.value;
      }}
    />
    <input
      type="text"
      placeholder="Event Location"
      defaultValue={formData.location}
      onChange={(e) => {
        formData.location = e.target.value;
      }}
    />
  </div>
);

const EventTracker = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  const addEvent = (date, title, location) => {
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        location,
        start: moment(date).startOf("day").toDate(),
        end: moment(date).endOf("day").toDate(),
      },
    ]);
  };

  const updateEvent = (id, title, location) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, title, location } : ev))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const openCreatePopup = (date) => {
    const formData = { title: "", location: "" };

    Popup.create({
      title: "Create Event",
      content: <EventForm formData={formData} />,
      buttons: {
        left: ["cancel"],
        right: [
          {
            text: "Save",
            className: "success",
            action: () => {
              if (formData.title.trim()) {
                addEvent(date, formData.title.trim(), formData.location.trim());
              }
              Popup.close();
            },
          },
        ],
      },
    });
  };

  const openEditPopup = (event) => {
    const formData = { title: event.title, location: event.location };

    Popup.create({
      title: "Edit Event",
      content: <EventForm formData={formData} />,
      buttons: {
        left: ["cancel"],
        right: [
          {
            text: "Save",
            className: "success",
            action: () => {
              if (formData.title.trim()) {
                updateEvent(event.id, formData.title.trim(), formData.location.trim());
              }
              Popup.close();
            },
          },
        ],
      },
    });
  };

  const openActionsPopup = (event) => {
    Popup.create({
      title: event.title,
      content: <div className="event-location">{event.location}</div>,
      buttons: {
        left: ["cancel"],
        right: [
          {
            text: "Edit",
            className: "info",
            action: () => {
              Popup.close();
              openEditPopup(event);
            },
          },
          {
            text: "Delete",
            className: "danger",
            action: () => {
              deleteEvent(event.id);
              Popup.close();
            },
          },
        ],
      },
    });
  };

  const handleSelectSlot = (slotInfo) => {
    const existing = events.find((ev) =>
      moment(ev.start).isSame(moment(slotInfo.start), "day")
    );
    if (existing) {
      openActionsPopup(existing);
    } else {
      openCreatePopup(slotInfo.start);
    }
  };

  const handleSelectEvent = (event) => {
    openActionsPopup(event);
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: isPastEvent(event) ? PAST_COLOR : UPCOMING_COLOR,
    },
  });

  const filteredEvents = events.filter((event) => {
    if (filter === "past") return isPastEvent(event);
    if (filter === "upcoming") return !isPastEvent(event);
    return true;
  });

  return (
    <div className="event-tracker">
      <h1>Event Tracker</h1>

      <div className="filter-buttons">
        <button className="btn" onClick={() => setFilter("all")}>
          All
        </button>
        <button className="btn" onClick={() => setFilter("past")}>
          Past
        </button>
        <button className="btn" onClick={() => setFilter("upcoming")}>
          Upcoming
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        selectable
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default EventTracker;
