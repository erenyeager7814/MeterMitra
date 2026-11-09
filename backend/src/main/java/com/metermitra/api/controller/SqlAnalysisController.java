package com.metermitra.api.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.metermitra.api.service.SqlAnalysisService;
import java.util.Map;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sql")
@Validated
public class SqlAnalysisController {
    private final SqlAnalysisService analysisService;

    public SqlAnalysisController(SqlAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/analyze")
    @ResponseStatus(HttpStatus.OK)
    public JsonNode analyze(@Valid @RequestBody AnalysisRequest request) {
        return analysisService.analyze(request.getSql(), request.getSchema());
    }

    public static class AnalysisRequest {
        @NotBlank
        @Size(max = 30000)
        private String sql;
        @Size(max = 50000)
        private String schema = "";

        public String getSql() { return sql; }
        public void setSql(String sql) { this.sql = sql; }
        public String getSchema() { return schema == null ? "" : schema; }
        public void setSchema(String schema) { this.schema = schema; }
    }
}
