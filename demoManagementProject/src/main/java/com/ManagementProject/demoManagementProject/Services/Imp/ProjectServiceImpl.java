package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Payload.Response.ProgressProjectResponse;
import com.ManagementProject.demoManagementProject.Payload.Response.SummaryProjectResponse;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import com.ManagementProject.demoManagementProject.Services.MailService;
import com.ManagementProject.demoManagementProject.Services.ProjectService;
import com.ManagementProject.demoManagementProject.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;  // Dùng để kiểm tra email người dùng tồn tại
    @Autowired
    private MailService mailService;

    @Autowired
    private TaskService taskService;

    @Override
    public Project createProject(Project project) {
        for (String email : project.getMembers()) {
            if (userRepository.findByEmail(email) == null) {
                mailService.inviteMemberMail(
                        email,
                        project.getProjectName(),
                        "http://localhost:8080/"
                );
            }
        }
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> getProjectById(String projectId) {
        return projectRepository.findById(projectId);
    }

    @Override
    public Optional<Project> getProjectByEmail(String email) {
        return Optional.empty();
    }


    @Override
    public Project updateProject(String projectId, Project projectDetails) {
        Optional<Project> existingProject = projectRepository.findById(projectId);
        if (existingProject.isPresent()) {
            Project updatedProject = existingProject.get();
            updatedProject.setProjectName(projectDetails.getProjectName());
            updatedProject.setDescription(projectDetails.getDescription());
            updatedProject.setStartDate(projectDetails.getStartDate());
            updatedProject.setEndDate(projectDetails.getEndDate());
            updatedProject.setStatus(projectDetails.getStatus());
            updatedProject.setBudget(projectDetails.getBudget());
            return projectRepository.save(updatedProject);
        }
        return null;
    }

    @Override
    // Xóa dự án
    public void deleteProject(String projectId) {
        projectRepository.deleteById(projectId);
    }

    @Override
    public List<Project> getProjectsByOwner(String ownerId) {
        return projectRepository.findByProjectOwnerId(ownerId);
    }

    @Override
    public Project addMembersToProject(String projectId, List<String> memberEmails) {


        Optional<Project> projectOpt = projectRepository.findByProjectId(projectId);
        if (projectOpt.isEmpty()) {
            throw new IllegalArgumentException("Dự án không tồn tại");
        }
        for (String email : memberEmails) {
            if (userRepository.findByEmail(email) == null) {
                mailService.inviteMemberMail(
                        email,
                        projectOpt.get().getProjectName(),
                        "http://localhost:8080/"
                        );
            }
        }

        Project project = projectOpt.get();

        if (project.getMembers() == null) {
            project.setMembers(new ArrayList<>());
        }

        List<String> newMembers = memberEmails.stream()
                .filter(email -> !project.getMembers().contains(email)) // Chỉ thêm nếu email chưa có
                .collect(Collectors.toList());
        project.getMembers().addAll(newMembers);

        return projectRepository.save(project);
    }

    @Override
    public List<Project> findByMembersContaining(String email) {
        return projectRepository.findByMembersContains(email);
    }

    @Override
    public boolean isProjectIDExists(String projectId) {

        return projectRepository.existsById(projectId);
    }

    @Override
    public SummaryProjectResponse getProjectSummary(String email) {
        SummaryProjectResponse summary = new SummaryProjectResponse();
        List<Project> projects = projectRepository.findByMembersContains(email);

        int totalProjectCompleted = 0;
        int overdueProjects = 0;
        int upcomingDeadlines = 0;
        LocalDate today = LocalDate.now();

        for (Project project : projects) {
            if ("completed".equalsIgnoreCase(project.getStatus())) {
                totalProjectCompleted++;
            }

            // parse date strings to LocalDate
            LocalDate endDate = null;
            try {
                endDate = LocalDate.parse(project.getEndDate()); // format: yyyy-MM-dd
            } catch (DateTimeParseException e) {
                // handle parse errors if needed
                continue;
            }

            if (!"completed".equalsIgnoreCase(project.getStatus()) && endDate.isBefore(today)) {
                overdueProjects++;
            }

            if (!"completed".equalsIgnoreCase(project.getStatus()) && !endDate.isBefore(today) && !endDate.isEqual(today)) {
                upcomingDeadlines++;
            }
        }

        summary.setTotalProjects(projects.size());
        summary.setCompletedProjects(totalProjectCompleted);
        summary.setOverdueProjects(overdueProjects);
        summary.setUpcomingDeadlines(upcomingDeadlines);

        return summary;
    }

    @Override
    public ProgressProjectResponse getProjectSummaryId(String projectId) {
        ProgressProjectResponse summary = new ProgressProjectResponse();
        Project project = projectRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        double progress = 0.0;
        int totalTask = 0;
        int completedTask = 0;
        int overdueTask = 0;

        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        for (Task task : tasks) {
            totalTask++;
            if ("completed".equalsIgnoreCase(task.getStatus())||"Completed".equalsIgnoreCase(task.getStatus())) {
                completedTask++;
            }
            LocalDate endDate = null;
            try {
                endDate = LocalDate.parse(task.getEndDate()); // format: yyyy-MM-dd
            } catch (DateTimeParseException e) {
                // handle parse errors if needed
                continue;
            }
            if (!"completed".equalsIgnoreCase(task.getStatus()) && endDate.isBefore(LocalDate.now())) {
                overdueTask++;
            }
        }
        if (totalTask > 0) {
            progress = ((double) completedTask / totalTask) ;
        }
        summary.setProgressPercentage(progress);
        summary.setTotalTasks(totalTask);
        summary.setCompletedTasks(completedTask);
        summary.setOverdueTasks(overdueTask);
        return summary;

    }

    @Override
    public void updateStatusProject(String projectId) {
        boolean isValidStatus = true;
        Project project = projectRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        for (Task task : tasks) {
            if(task.getStatus().equals("in progress")
                    ||task.getStatus().equals("In Progress")
                    ||task.getStatus().equals("Pending")
                    ||task.getStatus().equals("pending")
            ) {
                isValidStatus = false;
            }
        }
        if (isValidStatus) {
            project.setStatus("completed");
        } else {
            project.setStatus("in progress");
        }
        projectRepository.save(project);
    }


}
