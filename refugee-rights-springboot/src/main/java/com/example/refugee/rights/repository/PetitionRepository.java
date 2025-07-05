package com.example.refugee.rights.repository;

import com.example.refugee.rights.model.Petition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetitionRepository extends JpaRepository<Petition, Long> {

}


