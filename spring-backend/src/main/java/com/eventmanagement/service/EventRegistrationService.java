package com.eventmanagement.service;

import com.eventmanagement.entity.Event;
import com.eventmanagement.entity.EventRegistration;
import com.eventmanagement.entity.User;
import com.eventmanagement.repository.EventRegistrationRepository;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventRegistrationService(
            EventRegistrationRepository registrationRepository,
            EventRepository eventRepository,
            UserRepository userRepository) {

        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // Register current logged-in user for an event
    public EventRegistration registerForEvent(String email, Long eventId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Duplicate check
        if (registrationRepository.existsByUserIdAndEventId(
                user.getId(), eventId)) {
            throw new RuntimeException(
                    "User already registered for this event"
            );
        }

        // Capacity check
        long registeredCount =
                registrationRepository.countByEventId(eventId);

        if (registeredCount >= event.getCapacity()) {
            throw new RuntimeException("Event is full");
        }

        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);

        return registrationRepository.save(registration);
    }

    // Get registrations of current logged-in user
    public List<EventRegistration> getRegisteredEvents(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return registrationRepository.findByUserId(user.getId());
    }

    // Cancel registration
    public void cancelRegistration(Long registrationId) {

        EventRegistration registration =
                registrationRepository.findById(registrationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration not found"
                                ));

        registrationRepository.delete(registration);
    }
}