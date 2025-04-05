package com.ManagementProject.demoManagementProject.Controllers;


import com.ManagementProject.demoManagementProject.Models.Resources;
import com.ManagementProject.demoManagementProject.Services.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins ={ "http://172.26.8.178/","http://localhost:5173/"})
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public List<Resources> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/project/{projectId}")
    public List<Resources> getResourcesByProjectId(@PathVariable String projectId) {
        return resourceService.getResourcesByProjectId(projectId);
    }

    @PostMapping
    public Resources createResource(@RequestBody Resources resource) {
        return resourceService.createResource(resource);
    }

    @PutMapping("/{id}")
    public Resources updateResource(@PathVariable String id, @RequestBody Resources resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
    }
}