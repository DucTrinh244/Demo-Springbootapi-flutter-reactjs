package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.Resources;
import com.ManagementProject.demoManagementProject.Repositories.ResourcesRepository;
import com.ManagementProject.demoManagementProject.Services.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceServiceImp implements ResourceService {
    @Autowired
    private ResourcesRepository resourceRepository;

    public List<Resources> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public List<Resources> getResourcesByProjectId(String projectId) {
        return resourceRepository.findByProjectId(projectId);
    }

    @Override
    public Resources createResource(Resources resource) {
        resource.setCreatedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    @Override
    public Resources updateResource(String id, Resources updatedResource) {
        Resources resource = resourceRepository.findById(id).orElseThrow();
        resource.setResourceName(updatedResource.getResourceName());
        resource.setResourceType(updatedResource.getResourceType());
        resource.setDescription(updatedResource.getDescription());
        resource.setFilePath(updatedResource.getFilePath());
        resource.setUpdatedAt(java.time.LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    @Override
    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
