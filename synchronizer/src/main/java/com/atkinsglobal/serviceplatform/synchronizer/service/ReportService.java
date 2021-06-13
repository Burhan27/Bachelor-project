package com.atkinsglobal.serviceplatform.synchronizer.service;


import com.atkinsglobal.serviceplatform.synchronizer.model.Report;
import com.atkinsglobal.serviceplatform.synchronizer.repository.ReportRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.atkinsglobal.serviceplatform.synchronizer.utils.Operation;

import java.util.Map;

@Service
public class ReportService {

    private final ReportRepository reportRepository;


    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public void maintainReadModel(Map<String, Object> reportData, Operation operation) {
        final ObjectMapper mapper = new ObjectMapper();
        final Report report = mapper.convertValue(reportData, Report.class);

        if (Operation.DELETE.name().equals(operation.name())) {
            reportRepository.deleteById(report.getId());
        } else {
            reportRepository.save(report);
        }
    }
}

