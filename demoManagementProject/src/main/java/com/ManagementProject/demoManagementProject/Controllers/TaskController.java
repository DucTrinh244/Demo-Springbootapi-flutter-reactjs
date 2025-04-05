package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Payload.Request.TaskRequest;
import com.ManagementProject.demoManagementProject.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins ={ "http://172.26.8.178/","http://localhost:5173/"})

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // API tạo nhiệm vụ mới, kèm theo projectId
    @PostMapping("/{projectId}")
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest taskRequest, @PathVariable String projectId) {
        Task task = new Task();
        task.setTaskName(taskRequest.getTaskName());
        task.setDescription(taskRequest.getDescription());
        task.setAssigneeId(taskRequest.getAssigneeId());
        task.setStartDate(taskRequest.getStartDate());
        task.setEndDate(taskRequest.getEndDate());
        task.setPriority(taskRequest.getPriority());
        task.setStatus(taskRequest.getStatus());
        if (taskRequest.getSubtasks() != null) {
            task.setSubtasks(taskRequest.getSubtasks());
        }
        Task createdTask = taskService.createTask(task, projectId);  // Gửi projectId cho Service
        return ResponseEntity.status(201).body(createdTask);
    }
}