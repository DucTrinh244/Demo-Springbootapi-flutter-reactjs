package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.SubTask;
import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Payload.Request.SubTaskRequest;

import java.util.List;


public interface TaskService {

    Task createTask(Task task, String projectId) ;
    Task getTaskById(String taskId) ;

    Task getTaskByProjectId(String projectId) ;
    List<Task> getTasksByProjectId(String projectId) ;

    List<Task> getTasksByAssigneeEmail(String email);
    Task addSubTask(String taskId, SubTaskRequest subTaskRequest) ;
    Boolean checkCompleted(String taskId) ;

    Boolean checkSendMailInTask(String taskId, String email) ;

    int CountAllTaskWithStatus(String email, String status) ;

}