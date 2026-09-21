import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const [events, setEvents] = useState([]);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [showAdminRegistrations, setShowAdminRegistrations] =
    useState(false);

  const [registrations, setRegistrations] = useState([]);

  // Admin Event States
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");

  const [editingEventId, setEditingEventId] = useState(null);

  // =========================
  // JWT PAYLOAD
  // =========================

  const getTokenPayload = (token) => {
    try {
      if (!token) return null;

      const payload = token.split(".")[1];

      if (!payload) return null;

      return JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );
    } catch (error) {
      console.error("Invalid JWT token:", error);
      return null;
    }
  };

  // Get role from JWT
  const getRoleFromToken = (token) => {
    const payload = getTokenPayload(token);

    if (!payload) return null;

    return payload.role;
  };

  // Get user ID from JWT
  const getUserIdFromToken = (token) => {
    const payload = getTokenPayload(token);

    if (!payload) return null;

    return (
      payload.userId ||
      payload.user_id ||
      payload.id ||
      payload.subId ||
      null
    );
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        alert(data || "Login Failed");
        return;
      }

      const token = data.trim();

      const role = getRoleFromToken(token);
      const userId = getUserIdFromToken(token);

      console.log("JWT Role:", role);
      console.log("JWT User ID:", userId);

      localStorage.setItem("token", token);

      if (role) {
        localStorage.setItem("role", role);
      }

      if (userId) {
        localStorage.setItem("userId", userId);
      }

      setUserRole(role || "");
      setIsLoggedIn(true);

      alert("Login Successful!");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
    setUserRole("");
    setShowRegistrations(false);
    setShowAdminRegistrations(false);

    setEvents([]);
    setRegistrations([]);

    setEmail("");
    setPassword("");

    alert("Logged out successfully!");
  };

  // =========================
  // REGISTER USER
  // =========================

  const handleRegisterUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
            role: "USER",
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Registration Successful! Please login.");

        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setShowRegister(false);
      } else {
        alert(data || "Registration Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  // =========================
  // GET ALL EVENTS
  // =========================

  const getEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/events",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load events: ${response.status}`);
      }

      const data = await response.json();

      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      alert("Error loading events");
    }
  };

  // =========================
  // CLEAR EVENT FORM
  // =========================

  const clearEventForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventLocation("");
    setEventDate("");
    setEventTime("");
    setEventCapacity("");
    setEditingEventId(null);
  };

  // =========================
  // CREATE EVENT
  // =========================

  const handleCreateEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: eventTitle,
            description: eventDescription,
            location: eventLocation,
            date: eventDate,
            time: eventTime,
            capacity: Number(eventCapacity),
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Event Created Successfully!");

        clearEventForm();

        getEvents();
      } else {
        alert(data || "Failed to create event");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating event");
    }
  };

  // =========================
  // EDIT EVENT
  // =========================

  const handleEditClick = (event) => {
    setEditingEventId(event.id);

    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventLocation(event.location);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventCapacity(event.capacity);
  };

  // =========================
  // UPDATE EVENT
  // =========================

  const handleUpdateEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/events/${editingEventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: eventTitle,
            description: eventDescription,
            location: eventLocation,
            date: eventDate,
            time: eventTime,
            capacity: Number(eventCapacity),
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Event Updated Successfully!");

        clearEventForm();

        getEvents();
      } else {
        alert(data || "Failed to update event");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating event");
    }
  };

  // =========================
  // DELETE EVENT
  // =========================

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Event Deleted Successfully!");

        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
      } else {
        alert(data || "Failed to delete event");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting event");
    }
  };

  // =========================
  // USER - REGISTER EVENT
  // =========================

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");

      let userId = localStorage.getItem("userId");

      if (!userId) {
        userId = getUserIdFromToken(token);
      }

      if (!userId) {
        alert(
          "User ID not found in JWT. Please login again."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/registrations/user/${userId}/event/${eventId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Event Registered Successfully!");
      } else {
        alert(data || "Registration Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error registering for event");
    }
  };

  // =========================
  // USER - MY REGISTRATIONS
  // =========================

  const getMyRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");

      let userId = localStorage.getItem("userId");

      if (!userId) {
        userId = getUserIdFromToken(token);
      }

      if (!userId) {
        alert(
          "User ID not found in JWT. Please login again."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/registrations/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load registrations: ${response.status}`
        );
      }

      const data = await response.json();

      setRegistrations(data);
      setShowRegistrations(true);
    } catch (error) {
      console.error(
        "Error loading registrations:",
        error
      );

      alert("Error loading registrations");
    }
  };

  // =========================
  // ADMIN - ALL REGISTRATIONS
  // =========================

  const getAllRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login token not found. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/registrations",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load registrations: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("All Registrations:", data);

      setRegistrations(data);

      // IMPORTANT
      setShowAdminRegistrations(true);
    } catch (error) {
      console.error(
        "Error loading registrations:",
        error
      );

      alert(
        "Error loading registrations: " +
          error.message
      );
    }
  };

  // =========================
  // CANCEL REGISTRATION
  // =========================

  const handleCancelRegistration = async (
    registrationId
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/registrations/${registrationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert(
          "Registration Cancelled Successfully!"
        );

        setRegistrations((prevRegistrations) =>
          prevRegistrations.filter(
            (registration) =>
              registration.id !== registrationId
          )
        );
      } else {
        alert(
          data || "Failed to cancel registration"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error cancelling registration");
    }
  };

  // =========================
  // LOAD EVENTS AFTER LOGIN
  // =========================

  useEffect(() => {
    if (isLoggedIn) {
      getEvents();
    }
  }, [isLoggedIn]);

  // =========================
  // ADMIN - ALL REGISTRATIONS PAGE
  // =========================

  if (
    isLoggedIn &&
    userRole === "ADMIN" &&
    showAdminRegistrations
  ) {
    return (
      <div className="events-container">
        <div className="page-header">
          <h1>All Registrations</h1>

          <div>
            <button
              onClick={() =>
                setShowAdminRegistrations(false)
              }
            >
              Back to Dashboard
            </button>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {registrations.length === 0 ? (
          <p>No registrations available.</p>
        ) : (
          <div className="events-grid">
            {registrations.map((registration) => (
              <div
                className="event-card"
                key={registration.id}
              >
                <h2>
                  {registration.event?.title}
                </h2>

                <p>
                  <b>User:</b>{" "}
                  {registration.user?.name}
                </p>

                <p>
                  <b>Email:</b>{" "}
                  {registration.user?.email}
                </p>

                <p>
                  <b>Location:</b>{" "}
                  {registration.event?.location}
                </p>

                <p>
                  <b>Date:</b>{" "}
                  {registration.event?.date}
                </p>

                <p>
                  <b>Time:</b>{" "}
                  {registration.event?.time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================

  if (
    isLoggedIn &&
    userRole === "ADMIN"
  ) {
    return (
      <div className="events-container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>

          <div>
            <button
              onClick={getAllRegistrations}
            >
              View Registrations
            </button>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="login-card">
          <h2>
            {editingEventId
              ? "Update Event"
              : "Create New Event"}
          </h2>

          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) =>
              setEventTitle(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Description"
            value={eventDescription}
            onChange={(e) =>
              setEventDescription(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) =>
              setEventLocation(e.target.value)
            }
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) =>
              setEventDate(e.target.value)
            }
          />

          <input
            type="time"
            value={eventTime}
            onChange={(e) =>
              setEventTime(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Capacity"
            value={eventCapacity}
            onChange={(e) =>
              setEventCapacity(e.target.value)
            }
          />

          {editingEventId ? (
            <>
              <button
                onClick={handleUpdateEvent}
              >
                Update Event
              </button>

              <button
                onClick={clearEventForm}
              >
                Cancel Edit
              </button>
            </>
          ) : (
            <button
              onClick={handleCreateEvent}
            >
              Create Event
            </button>
          )}
        </div>

        <h2>All Events</h2>

        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div
                className="event-card"
                key={event.id}
              >
                <h2>{event.title}</h2>

                <p>{event.description}</p>

                <p>
                  <b>Location:</b>{" "}
                  {event.location}
                </p>

                <p>
                  <b>Date:</b> {event.date}
                </p>

                <p>
                  <b>Time:</b> {event.time}
                </p>

                <p>
                  <b>Capacity:</b>{" "}
                  {event.capacity}
                </p>

                <button
                  onClick={() =>
                    handleEditClick(event)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDeleteEvent(event.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // USER EVENTS PAGE
  // =========================

  if (
    isLoggedIn &&
    !showRegistrations
  ) {
    return (
      <div className="events-container">
        <div className="page-header">
          <h1>Available Events</h1>

          <div>
            <button
              onClick={getMyRegistrations}
            >
              My Registrations
            </button>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div
                className="event-card"
                key={event.id}
              >
                <h2>{event.title}</h2>

                <p>{event.description}</p>

                <p>
                  <b>Location:</b>{" "}
                  {event.location}
                </p>

                <p>
                  <b>Date:</b> {event.date}
                </p>

                <p>
                  <b>Time:</b> {event.time}
                </p>

                <p>
                  <b>Capacity:</b>{" "}
                  {event.capacity}
                </p>

                <button
                  onClick={() =>
                    handleRegister(event.id)
                  }
                >
                  Register
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // MY REGISTRATIONS PAGE
  // =========================

  if (
    isLoggedIn &&
    showRegistrations
  ) {
    return (
      <div className="events-container">
        <div className="page-header">
          <h1>My Registrations</h1>

          <div>
            <button
              onClick={() =>
                setShowRegistrations(false)
              }
            >
              Back to Events
            </button>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {registrations.length === 0 ? (
          <p>
            You have not registered for any
            events.
          </p>
        ) : (
          <div className="events-grid">
            {registrations.map(
              (registration) => (
                <div
                  className="event-card"
                  key={registration.id}
                >
                  <h2>
                    {registration.event?.title}
                  </h2>

                  <p>
                    {
                      registration.event
                        ?.description
                    }
                  </p>

                  <p>
                    <b>Location:</b>{" "}
                    {
                      registration.event
                        ?.location
                    }
                  </p>

                  <p>
                    <b>Date:</b>{" "}
                    {registration.event?.date}
                  </p>

                  <p>
                    <b>Time:</b>{" "}
                    {registration.event?.time}
                  </p>

                  <p>
                    <b>Capacity:</b>{" "}
                    {
                      registration.event
                        ?.capacity
                    }
                  </p>

                  <button
                    onClick={() =>
                      handleCancelRegistration(
                        registration.id
                      )
                    }
                  >
                    Cancel Registration
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // REGISTER PAGE
  // =========================

  if (showRegister) {
    return (
      <div className="container">
        <div className="login-card">
          <h1>Create Account</h1>

          <p>Register as a new user</p>

          <input
            type="text"
            placeholder="Enter your name"
            value={registerName}
            onChange={(e) =>
              setRegisterName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={registerEmail}
            onChange={(e) =>
              setRegisterEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={registerPassword}
            onChange={(e) =>
              setRegisterPassword(
                e.target.value
              )
            }
          />

          <button
            onClick={handleRegisterUser}
          >
            Register
          </button>

          <p className="register-text">
            Already have an account?{" "}
            <span
              onClick={() =>
                setShowRegister(false)
              }
            >
              Login
            </span>
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================

  return (
    <div className="container">
      <div className="login-card">
        <h1>Event Management</h1>

        <p>Login to your account</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p className="register-text">
          Don't have an account?{" "}
          <span
            onClick={() =>
              setShowRegister(true)
            }
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;