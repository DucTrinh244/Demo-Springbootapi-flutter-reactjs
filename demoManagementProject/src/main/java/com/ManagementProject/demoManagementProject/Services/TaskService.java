package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.Task;


public interface TaskService {

    Task createTask(Task task, String projectId) ;
}