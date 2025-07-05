package com.example.refugee.rights.controller;

import com.example.refugee.rights.model.Signature;
import com.example.refugee.rights.repository.SignatureRepository;
import com.example.refugee.rights.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/signatures")
@CrossOrigin(origins = "http://localhost:5173")
public class SignatureController {

    private final SignatureRepository repo;
    private final EmailService emailService;

    public SignatureController(SignatureRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> createSignature(@RequestBody Signature sig) {
        sig.setSignedAt(LocalDateTime.now());
        repo.save(sig);
        emailService.sendThankYouEmail(sig);
        return ResponseEntity.ok("Thank you!");
    }

    @GetMapping
    public List<Signature> getAllSignatures() {
        return repo.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSignature(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats/daily")
    public List<Map<String, Object>> dailyStats() {
        return repo.findSignaturesPerDay().stream()
                .map(arr -> Map.of("date", arr[0], "count", arr[1]))
                .collect(Collectors.toList());
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new java.util.HashMap<>();
        analytics.put("totalSignatures", repo.count());

        List<Signature> allSignatures = repo.findAll();
        Map<String, Long> hometownCounts = allSignatures.stream()
                .collect(Collectors.groupingBy(Signature::getHometown, Collectors.counting()));

        analytics.put("hometownCounts", hometownCounts);
        return analytics;
    }


}
