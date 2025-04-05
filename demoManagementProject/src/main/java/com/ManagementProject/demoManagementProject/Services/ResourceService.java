package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.Resources;

import java.util.List;

public interface ResourceService{


     List<Resources> getAllResources() ;

     List<Resources> getResourcesByProjectId(String projectId) ;

     Resources createResource(Resources resource) ;

     Resources updateResource(String id, Resources updatedResource);

     void deleteResource(String id) ;
}
