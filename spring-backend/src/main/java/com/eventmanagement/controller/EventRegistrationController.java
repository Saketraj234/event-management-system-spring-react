package com.eventmanagement.controller;

import com.eventmanagement.entity.EventRegistration;
import com.eventmanagement.service.EventRegistrationService;
import com.eventmanagement.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class EventRegistrationController {

    private final EventRegistrationService registrationService;
    private final JwtService jwtService;

    public EventRegistrationController(
            EventRegistrationService registrationService,
            JwtService jwtService) {

        this.registrationService = registrationService;
        this.jwtService = jwtService;
    }

    // Get email from JWT token
    private String getEmailFromToken(String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            throw new RuntimeException("Invalid or missing token");
        }

        String token = authorizationHeader.substring(7);

        return jwtService.extractEmail(token);
    }

    // Register current logged-in user for an event
    @PostMapping("/event/{eventId}")
    public ResponseEntity<EventRegistration> registerForEvent(
            @PathVariable Long eventId,
            @RequestHeader("Authorization") String authorizationHeader) {

        String email = getEmailFromToken(authorizationHeader);

        EventRegistration registration =
                registrationService.registerForEvent(email, eventId);

        return ResponseEntity.ok(registration);
    }

    // Get all registered events of current logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<EventRegistration>> getMyRegisteredEvents(
            @RequestHeader("Authorization") String authorizationHeader) {

        String email = getEmailFromToken(authorizationHeader);

        List<EventRegistration> registrations =
                registrationService.getRegisteredEvents(email);

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