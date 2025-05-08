package com.ManagementProject.demoManagementProject.Payload.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectMonthlyStatsResponse {
    private String name; // "Jan", "Feb", ...
    private int completedProjects;
}
