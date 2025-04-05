package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.ProjectUpdates;
import com.ManagementProject.demoManagementProject.Payload.Request.TaskCompletionRequest;
import com.ManagementProject.demoManagementProject.Services.ProjectUpdatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins ={ "http://172.26.8.178/","http://localhost:5173/"})

@RestController
@RequestMapping("/api/project-udpate")
public class ProjectUpdatesController {

    @Autowired
    private ProjectUpdatesService projectUpdatesService;

    @PostMapping("/{projectId}")
    public ProjectUpdates createUpdate(@PathVariable String projectId, @RequestBody ProjectUpdates update) {
        update.setProjectId(projectId);  // Đảm bảo rằng thuộc tính projectId được thiết lập
        return projectUpdatesService.saveUpdate(update);
    }


    @GetMapping("/project/{projectId}")
    public List<ProjectUpdates> getUpdatesByProjectId(@PathVariable String projectId) {
        return projectUpdatesService.getUpdatesByProjectId(projectId);
    }

    @GetMapping("/status/{status}")
    public List<ProjectUpdates> getUpdatesByStatus(@PathVariable String status) {
        return projectUpdatesService.getUpdatesByStatus(status);
    }

    @GetMapping("/user/{updatedBy}")
    public List<ProjectUpdates> getUpdatesByUser(@PathVariable String updatedBy) {
        return projectUpdatesService.getUpdatesByUser(updatedBy);
    }

    @PostMapping("/complete-task")
    public ProjectUpdates completeTask(@RequestBody TaskCompletionRequest request) {
        // Tạo đối tượng ProjectUpdates khi task hoàn thành
        ProjectUpdates update = new ProjectUpdates();
        update.setProjectId(request.getProjectId());
        update.setUpdateDate(new Date());
        update.setUpdateDescription("Hoàn thành task: " + request.getTaskName());
        update.setUpdatedBy(request.getUpdatedBy());
        update.setStatus("On Track"); // hoặc cập nhật dựa trên trạng thái của task
        update.setNextSteps("Tiếp theo kiểm thử và triển khai");

        // Lưu cập nhật vào cơ sở dữ liệu MongoDB
        return projectUpdatesService.saveUpdate(update);
    }
}
