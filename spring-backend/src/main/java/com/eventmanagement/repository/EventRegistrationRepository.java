package com.eventmanagement.repository;

import com.eventmanagement.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRegistrationRepository
        extends JpaRepository<EventRegistration, Long> {

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    long countByEventId(Long eventId);

    List<EventRegistration> findByUserId(Long userId);

    List<EventRegistration> findByUserEmail(String email);

    void deleteByEventId(Long eventId);
}