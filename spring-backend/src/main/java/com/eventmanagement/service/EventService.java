package com.eventmanagement.service;

import com.eventmanagement.entity.Event;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.EventRegistrationRepository;
import org.springframework.stereotype.Service;
import com.eventmanagement.exception.EventNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;

    public EventService(
            EventRepository eventRepository,
            EventRegistrationRepository eventRegistrationRepository
    ) {
        this.eventRepository = eventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new EventNotFoundException(
                                "Event not found with id: " + id
                        ));
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setLocation(eventDetails.getLocation());
        event.setDate(eventDetails.getDate());
        event.setTime(eventDetails.getTime());
        event.setCapacity(eventDetails.getCapacity());

        return eventRepository.save(event);
    }

    // Delete Event and its registrations
    @Transactional
    public void deleteEvent(Long id) {

        // Check event exists
        Event event = getEventById(id);

        // First delete all registrations related to this event
        eventRegistrationRepository.deleteByEventId(id);

        // Then delete event
        eventRepository.delete(event);
    }
}