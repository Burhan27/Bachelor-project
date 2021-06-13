package com.atkinsglobal.serviceplatform.synchronizer.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.io.Serializable;
import java.util.Map;

@Getter
@Setter
@Data
@Document(indexName = "report", shards = 1,replicas = 0,refreshInterval = "-1")
public class Report implements Serializable {


    private Integer version;

    @Id
    private Integer id;

    private String report_id;

    private String component_ref;

    private String title;

    private String description;

    @Field(type = FieldType.Keyword)
    private String report_type;

    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Keyword)
    private String priority;

    @Field(type = FieldType.Keyword)
    private String status;

    @Field(type = FieldType.Keyword)
    private String responsible;

    private String report_geometry;

    @Field(type = FieldType.Nested, includeInParent = true)
    private Map<String, Object> dynamic_fields;

    @Field(type = FieldType.Boolean)
    private boolean ignore_validation_errors;

    private String getIgnore_validation_comment;

    @Field(type = FieldType.Keyword)
    private String created_by;

    @Field(type = FieldType.Keyword)
    private String edited_by;

    private Integer definition_version;

   // @Field(type = FieldType.Date)
    private String valid_from;

   // @Field(type = FieldType.Date)
    private String valid_to;

    @Field(type = FieldType.Boolean)
    private boolean prevent_history;
}
