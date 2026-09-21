package com.eventmanagement.controller;

import com.eventmanagement.entity.EventRegistration;
import com.eventmanagement.service.EventRegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class EventRegistrationController {

    private final EventRegistrationService registrationService;

    public EventRegistrationController(
            EventRegistrationService registrationService) {

        this.registrationService = registrationService;
    }

    // Register user for an event
    @PostMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<EventRegistration> registerForEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {

        EventRegistration registration =
                registrationService.registerForEvent(userId, eventId);

        return ResponseEntity.ok(registration);
    }

    // Get all registrations
    @GetMapping
    public ResponseEntity<List<EventRegistration>> getAllRegistrations() {

        List<EventRegistration> registrations =
                registrationService.getAllRegistrations();

        return ResponseEntity.ok(registrations);
    }

    // Get all registered events of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventRegistration>> getRegisteredEvents(
            @PathVariable Long userId) {

        List<EventRegistration> registrations =
                registrationService.getRegisteredEvents(userId);

        return ResponseEntity.ok(registrations);
    }

    // Cancel registration
    @DeleteMapping("/{registrationId}")
    public ResponseEntity<String> cancelRegistration(
            @PathVariable Long registrationId) {

        registrationService.cancelRegistration(registrationId);

        return ResponseEntity.ok("Registration cancelled successfully");
    }
}