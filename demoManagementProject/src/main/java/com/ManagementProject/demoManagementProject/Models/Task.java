package com.ManagementProject.demoManagementProject.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;
    private String taskName;
    private String description;
    private String assigneeId;
    private String startDate;
    private String endDate;
    private String priority;
    private String status;
    private Project project;
    private List<SubTask> subtasks;  // List Task



}
