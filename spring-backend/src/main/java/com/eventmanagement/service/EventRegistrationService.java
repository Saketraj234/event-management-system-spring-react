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

    // Register user for an event
    public EventRegistration registerForEvent(Long userId, Long eventId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Duplicate registration check
        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new RuntimeException("User already registered for this event");
        }

        // Event capacity check
        long registeredCount = registrationRepository.countByEventId(eventId);

        if (registeredCount >= event.getCapacity()) {
            throw new RuntimeException("Event is full");
        }

        EventRegistration registration = new EventRegistration();

        registration.setUser(user);
        registration.setEvent(event);

        return registrationRepository.save(registration);
    }

    // Get all registrations
    public List<EventRegistration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    // Get all registered events of a user
    public List<EventRegistration> getRegisteredEvents(Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return registrationRepository.findByUserId(userId);
    }

    // Cancel registration
    public void cancelRegistration(Long registrationId) {

        EventRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() ->
                        new RuntimeException("Registration not found"));

        registrationRepository.delete(registration);
    }
}