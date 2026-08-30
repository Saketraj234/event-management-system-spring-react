package com.eventmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "event_registrations",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "event_id"})
        }
)
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which User registered
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Which Event the user registered for
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    public EventRegistration() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}