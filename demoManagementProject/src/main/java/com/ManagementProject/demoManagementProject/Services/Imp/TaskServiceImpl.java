package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Models.SubTask;
import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Payload.Request.SubTaskRequest;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import com.ManagementProject.demoManagementProject.Repositories.TaskRepository;
import com.ManagementProject.demoManagementProject.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository; // Để lấy thông tin dự án từ Project

    // Tạo nhiệm vụ và liên kết với dự án
    @Override
    public Task createTask(Task task, String projectId) {
        return taskRepository.save(task);
    }

    @Override
    public Task getTaskById(String taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public Task getTaskByProjectId(String projectId) {
        return null;
    }

    @Override
    public List<Task> getTasksByProjectId(String projectId) {


        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> getTasksByAssigneeEmail(String email) {
        return taskRepository.findByAssigneeEmail(email);
    }

    @Override
    public Task addSubTask(String taskId, SubTaskRequest subTaskRequest) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getSubtasks() == null) {
            task.setSubtasks(new ArrayList<>());
        }
        SubTask subTask = new SubTask();
        subTask.setSubtaskName(subTaskRequest.getSubtaskName());
        subTask.setDescription(subTaskRequest.getDescription());
        subTask.setAssigneeEmail(subTaskRequest.getAssigneeEmail());
        subTask.setStartDate(subTaskRequest.getStartDate());
        subTask.setEndDate(subTaskRequest.getEndDate());
        subTask.setStatus(subTaskRequest.getStatus());

        task.getSubtasks().add(subTask);

        return taskRepository.save(task);
    }

    @Override
    public Boolean checkCompleted(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Kiểm tra xem tất cả các subtask đã hoàn thành chưa
        if (task.getSubtasks() != null) {
            for (SubTask subTask : task.getSubtasks()) {
                if (!subTask.getStatus().equals("completed")) {
                    return false;
                }
            }
        }
        return true;
    }

    @Override
    public Boolean checkSendMailInTask(String taskId, String email) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        Project project = projectRepository.findByProjectId(task.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Kiểm tra xem email có phải là người được giao nhiệm vụ không
        if (task.getAssigneeEmail().equals(email) || project.getProjectOwnerId().equals(email)) {
            return true;
        } else {
            return false;
        }
    }

}
