package com.example.refugee.rights.controller;

import com.example.refugee.rights.model.Petition;
import com.example.refugee.rights.repository.PetitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/petitions")
@CrossOrigin(origins = "http://localhost:5173")
public class PetitionController {

    @Autowired
    private PetitionRepository petitionRepo;

    private long viewCount = 0;

    @GetMapping("/{id}")
    public ResponseEntity<Petition> getPetition(@PathVariable Long id){
        viewCount++;
        return ResponseEntity.of(petitionRepo.findById(id));
    }

    @GetMapping("/{id}/views")
    public Map<String, Long> getViewCount(@PathVariable Long id) {
        return Map.of("views", viewCount);
    }
}
