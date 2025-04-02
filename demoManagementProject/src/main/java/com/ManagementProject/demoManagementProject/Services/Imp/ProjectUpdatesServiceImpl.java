package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.ProjectUpdates;
import com.ManagementProject.demoManagementProject.Repositories.ProjectUpdatesRepository;
import com.ManagementProject.demoManagementProject.Services.ProjectUpdatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectUpdatesServiceImpl implements ProjectUpdatesService {
    @Autowired
    private ProjectUpdatesRepository projectUpdatesRepository;

    @Override
    public ProjectUpdates saveUpdate(ProjectUpdates update) {
        return projectUpdatesRepository.save(update);
    }

    @Override
    public List<ProjectUpdates> getUpdatesByProjectId(String projectId) {
        return projectUpdatesRepository.findByProjectId(projectId);
    }

    @Override
    public List<ProjectUpdates> getUpdatesByStatus(String status) {
        return projectUpdatesRepository.findByStatus(status);
    }

    @Override
    public List<ProjectUpdates> getUpdatesByUser(String updatedBy) {
        return projectUpdatesRepository.findByUpdatedBy(updatedBy);
    }
}
