package com.example.messengertgnk.service;

import com.example.messengertgnk.entity.Media;
import com.example.messengertgnk.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    public Optional<Media> findMediaById(Long id) {
        return mediaRepository.findMediaById(id);
    }
}
