package com.metermitra.api.controller;

import com.metermitra.api.model.Rickshaw;
import com.metermitra.api.repository.RickshawRepository;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rickshaws")
@CrossOrigin(origins = "http://localhost:4200")
public class RickshawController {

    private final RickshawRepository rickshawRepository;

    public RickshawController(RickshawRepository rickshawRepository) {
        this.rickshawRepository = rickshawRepository;
    }

    @GetMapping
    public List<Rickshaw> findAll() {
        return rickshawRepository.findAll();
    }
}

