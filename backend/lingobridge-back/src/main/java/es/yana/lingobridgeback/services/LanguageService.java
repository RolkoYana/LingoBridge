package es.yana.lingobridgeback.services;

import es.yana.lingobridgeback.entities.Language;
import es.yana.lingobridgeback.repositories.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LanguageService {

    @Autowired
    private LanguageRepository languageRepository;

    public Language findByName(String name) {
        return languageRepository.findByName(name).orElseThrow();
    }

}
