package com.example.refugee.rights.repository;

import com.example.refugee.rights.model.Signature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SignatureRepository extends JpaRepository<Signature, Long> {
    @Query("SELECT DATE(s.signedAt), COUNT(s) " +
            "FROM Signature s GROUP BY DATE(s.signedAt)")
    List<Object[]> findSignaturesPerDay();
}
