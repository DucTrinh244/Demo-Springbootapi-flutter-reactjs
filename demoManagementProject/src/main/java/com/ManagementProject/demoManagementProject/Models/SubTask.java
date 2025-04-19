package com.ManagementProject.demoManagementProject.Models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Setter
@Getter
@NoArgsConstructor
public class SubTask {
    private String subtaskName;
    private String description;
    private String assigneeEmail;
    private String startDate;
    private String endDate;
    private String status;
}