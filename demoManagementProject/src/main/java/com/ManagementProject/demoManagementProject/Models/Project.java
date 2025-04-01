package com.ManagementProject.demoManagementProject.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    private String projectId;
    private String projectName;
    private String description;
    private String startDate;
    private String endDate;
    private String projectOwnerId;
    private String status;
    private double budget;
}
