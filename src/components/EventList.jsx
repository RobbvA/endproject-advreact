// src/components/EventList.js
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const EventList = () => {
  const {
    categories,
    loading: catLoading,
    error: catError,
  } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const res = await fetch("http://localhost:3000/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
        setLoadingEvents(false);
      } catch (err) {
        setErrorEvents(err.message);
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  if (catLoading || loadingEvents) return <p>Loading...</p>;
  if (catError) return <p>Error loading categories: {catError}</p>;
  if (errorEvents) return <p>Error loading events: {errorEvents}</p>;

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => {
          const eventCategories = event.categoryIds.map((catId) => {
            const cat = categories.find((c) => c.id === catId.toString());
            return cat ? cat.name : "Unknown";
          });

          return (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Categories: {eventCategories.join(", ")}</p>
              <p>Location: {event.location}</p>
              <img
                src={event.image}
                alt={event.title}
                style={{ width: "200px" }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EventList;
