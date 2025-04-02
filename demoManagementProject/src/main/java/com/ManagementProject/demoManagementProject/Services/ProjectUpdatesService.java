package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.ProjectUpdates;

import java.util.List;

public interface ProjectUpdatesService {
    public ProjectUpdates saveUpdate(ProjectUpdates update) ;

    public List<ProjectUpdates> getUpdatesByProjectId(String projectId) ;

    public List<ProjectUpdates> getUpdatesByStatus(String status);

    public List<ProjectUpdates> getUpdatesByUser(String updatedBy);
}
