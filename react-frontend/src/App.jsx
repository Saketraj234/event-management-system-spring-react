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
  const [registrations, setRegistrations] = useState([]);

  // Admin Create / Update Event States
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");

  // Edit state
  const [editingEventId, setEditingEventId] = useState(null);

  // Get role from JWT token
  const getRoleFromToken = (token) => {
    try {
      const payload = token.split(".")[1];

      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      return decodedPayload.role;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  // Login
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

      if (response.ok) {
        const role = getRoleFromToken(data);

        localStorage.setItem("token", data);
        localStorage.setItem("role", role);

        setUserRole(role);
        setIsLoggedIn(true);

        alert("Login Successful!");
      } else {
        alert(data || "Login Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setUserRole("");
    setShowRegistrations(false);
    setEvents([]);
    setRegistrations([]);
    setEmail("");
    setPassword("");

    alert("Logged out successfully!");
  };

  // Register new user
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

  // Get all events
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

      const data = await response.json();

      if (response.ok) {
        setEvents(data);
      } else {
        alert("Failed to load events");
      }
    } catch (error) {
      console.error(error);
      alert("Error loading events");
    }
  };

  // Clear event form
  const clearEventForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventLocation("");
    setEventDate("");
    setEventTime("");
    setEventCapacity("");
    setEditingEventId(null);
  };

  // ADMIN - Create Event
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

  // Start editing event
  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventLocation(event.location);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventCapacity(event.capacity);
  };

  // ADMIN - Update Event
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

  // ADMIN - Delete Event
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

  // USER - Register for event
  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/registrations/event/${eventId}`,
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

  // USER - Get current user's registrations
  const getMyRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/registrations/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRegistrations(data);
        setShowRegistrations(true);
      } else {
        alert("Failed to load registrations");
      }
    } catch (error) {
      console.error(error);
      alert("Error loading registrations");
    }
  };

  // Cancel registration
  const handleCancelRegistration = async (registrationId) => {
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
        alert("Registration Cancelled Successfully!");

        setRegistrations((prevRegistrations) =>
          prevRegistrations.filter(
            (registration) => registration.id !== registrationId
          )
        );
      } else {
        alert(data || "Failed to cancel registration");
      }
    } catch (error) {
      console.error(error);
      alert("Error cancelling registration");
    }
  };

  // Load events after login
  useEffect(() => {
    if (isLoggedIn) {
      getEvents();
    }
  }, [isLoggedIn]);

  // ADMIN Dashboard
  if (isLoggedIn && userRole === "ADMIN") {
    return (
      <div className="events-container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="login-card">
          <h2>
            {editingEventId ? "Update Event" : "Create New Event"}
          </h2>

          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />

          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />

          <input
            type="number"
            placeholder="Capacity"
            value={eventCapacity}
            onChange={(e) => setEventCapacity(e.target.value)}
          />

          {editingEventId ? (
            <>
              <button onClick={handleUpdateEvent}>
                Update Event
              </button>

              <button onClick={clearEventForm}>
                Cancel Edit
              </button>
            </>
          ) : (
            <button onClick={handleCreateEvent}>
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
              <div className="event-card" key={event.id}>
                <h2>{event.title}</h2>
                <p>{event.description}</p>

                <p><b>Location:</b> {event.location}</p>
                <p><b>Date:</b> {event.date}</p>
                <p><b>Time:</b> {event.time}</p>
                <p><b>Capacity:</b> {event.capacity}</p>

                <button onClick={() => handleEditClick(event)}>
                  Edit
                </button>

                <button onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // USER Events Page
  if (isLoggedIn && !showRegistrations) {
    return (
      <div className="events-container">
        <div className="page-header">
          <h1>Available Events</h1>

          <div>
            <button onClick={getMyRegistrations}>
              My Registrations
            </button>

            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div className="event-card" key={event.id}>
                <h2>{event.title}</h2>
                <p>{event.description}</p>

                <p><b>Location:</b> {event.location}</p>
                <p><b>Date:</b> {event.date}</p>
                <p><b>Time:</b> {event.time}</p>
                <p><b>Capacity:</b> {event.capacity}</p>

                <button onClick={() => handleRegister(event.id)}>
                  Register
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // My Registrations Page
  if (isLoggedIn && showRegistrations) {
    return (
      <div className="events-container">
        <div className="page-header">
          <h1>My Registrations</h1>

          <div>
            <button onClick={() => setShowRegistrations(false)}>
              Back to Events
            </button>

            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {registrations.length === 0 ? (
          <p>You have not registered for any events.</p>
        ) : (
          <div className="events-grid">
            {registrations.map((registration) => (
              <div className="event-card" key={registration.id}>
                <h2>{registration.event.title}</h2>
                <p>{registration.event.description}</p>

                <p>
                  <b>Location:</b> {registration.event.location}
                </p>

                <p>
                  <b>Date:</b> {registration.event.date}
                </p>

                <p>
                  <b>Time:</b> {registration.event.time}
                </p>

                <p>
                  <b>Capacity:</b> {registration.event.capacity}
                </p>

                <button
                  onClick={() =>
                    handleCancelRegistration(registration.id)
                  }
                >
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Register Page
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
            onChange={(e) => setRegisterName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />

          <button onClick={handleRegisterUser}>Register</button>

          <p className="register-text">
            Already have an account?{" "}
            <span onClick={() => setShowRegister(false)}>
              Login
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Login Page
  return (
    <div className="container">
      <div className="login-card">
        <h1>Event Management</h1>
        <p>Login to your account</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="register-text">
          Don't have an account?{" "}
          <span onClick={() => setShowRegister(true)}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;