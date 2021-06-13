package com.atkinsglobal.serviceplatform.synchronizer.repository;

import com.atkinsglobal.serviceplatform.synchronizer.model.Report;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends ElasticsearchRepository<Report, Integer> {

    Optional<Report> findById(Integer id);
    void deleteById(Integer id);
}
