package com.ManagementProject.demoManagementProject.Models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "project_updates")
public class ProjectUpdate {

    @Id
    private String updateId;
    private String projectId;
    private String updateDate;
    private String updateDescription;
    private String updatedBy;
}
