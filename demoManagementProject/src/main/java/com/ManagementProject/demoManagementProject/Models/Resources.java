package com.ManagementProject.demoManagementProject.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resources {
    @Id
    private String id;
    private String projectId;
    private String resourceName;
    private String resourceType;
    private String description;
    private String filePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
