package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Payload.Request.StatusRequest;
import com.ManagementProject.demoManagementProject.Payload.Request.SubTaskRequest;
import com.ManagementProject.demoManagementProject.Payload.Request.TaskRequest;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import com.ManagementProject.demoManagementProject.Services.ProjectService;
import com.ManagementProject.demoManagementProject.Services.TaskService;
import com.ManagementProject.demoManagementProject.Utils.CurrentUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserRepository userRepository;

    // API tạo nhiệm vụ mới, kèm theo projectId
//    @PostMapping("/{projectId}")
//    public ResponseEntity<Task> createTask(@RequestBody TaskRequest taskRequest, @PathVariable String projectId) {
//        if (userRepository.existsByEmail(taskRequest.getAssigneeEmail())) {
//            return ResponseEntity.status(301).body(null);
//        }
//        Task task = new Task();
//        task.setTaskName(taskRequest.getTaskName());
//        task.setDescription(taskRequest.getDescription());
//        task.setAssigneeEmail(taskRequest.getAssigneeEmail());
//        task.setStartDate(taskRequest.getStartDate());
//        task.setEndDate(taskRequest.getEndDate());
//        task.setPriority(taskRequest.getPriority());
//        task.setStatus(taskRequest.getStatus());
//        task.setProjectId(projectId);
//        if (taskRequest.getSubtasks() != null) {
//            task.setSubtasks(taskRequest.getSubtasks());
//        }
//        if(!projectService.isProjectIDExists(projectId))
//            return ResponseEntity.status(400).body(null); // Trả về lỗi nếu projectId không tồn tại
//
//
//        Task createdTask = taskService.createTask(task, projectId);  // Gửi projectId cho Service
//        return ResponseEntity.status(200).body(createdTask);
//    }
    @PostMapping("/{projectId}")
    public ResponseEntity<?> createTask(@RequestBody TaskRequest taskRequest, @PathVariable String projectId) {

        if (!projectService.isProjectIDExists(projectId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Project ID không tồn tại!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (!userRepository.existsByEmail(taskRequest.getAssigneeEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email người được giao task không tồn tại!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Task task = new Task();
        task.setTaskName(taskRequest.getTaskName());
        task.setDescription(taskRequest.getDescription());
        task.setAssigneeEmail(taskRequest.getAssigneeEmail());
        task.setStartDate(taskRequest.getStartDate());
        task.setEndDate(taskRequest.getEndDate());
        task.setPriority(taskRequest.getPriority());
        task.setStatus(taskRequest.getStatus());
        task.setProjectId(projectId);
        if (taskRequest.getSubtasks() != null) {
            task.setSubtasks(taskRequest.getSubtasks());
        }

        Task createdTask = taskService.createTask(task, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(createdTask);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        Task task = taskService.getTaskById(id);
        if (task != null) {
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
        @GetMapping("/projectId/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProjectId(@PathVariable String projectId) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        if (tasks != null && !tasks.isEmpty()) {
            return ResponseEntity.ok(tasks);
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/my-task")
    public ResponseEntity<List<Task>> getTasksByAssigneeEmail() {
        String email = CurrentUserUtil.getCurrentUserEmail();
        List<Task> tasks = taskService.getTasksByAssigneeEmail(email);
        if (tasks != null && !tasks.isEmpty()) {
            return ResponseEntity.ok(tasks);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{taskId}/subtasks")
    public ResponseEntity<Task> addSubTask(@PathVariable String taskId, @RequestBody SubTaskRequest subTaskRequest) {
        Task updatedTask = taskService.addSubTask(taskId, subTaskRequest);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{taskId}/subtasks/{index}/status")
    public ResponseEntity<Task> updateSubTaskStatus(
                @PathVariable String taskId,
                @PathVariable int index,
                @RequestBody StatusRequest request) {
        Task task = taskService.getTaskById(taskId);

        if (task != null && task.getSubtasks() != null && index >= 0 && index < task.getSubtasks().size()) {
            task.getSubtasks().get(index).setStatus(request.getStatus());
            taskService.createTask(task, task.getProjectId());
            if(taskService.checkCompleted(taskId)){
                task.setStatus("completed");
                taskService.createTask(task, task.getProjectId());
            }else{
                task.setStatus("In Progress");
                taskService.createTask(task, task.getProjectId());
            }
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}