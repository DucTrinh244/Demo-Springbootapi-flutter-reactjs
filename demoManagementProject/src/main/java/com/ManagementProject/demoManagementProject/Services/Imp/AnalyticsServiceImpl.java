package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.Project;
import com.ManagementProject.demoManagementProject.Models.Task;
import com.ManagementProject.demoManagementProject.Payload.Response.ProjectMonthlyStatsResponse;
import com.ManagementProject.demoManagementProject.Payload.Response.ProjectStatusDistributionResponse;
import com.ManagementProject.demoManagementProject.Payload.Response.SummaryOverviewResponse;
import com.ManagementProject.demoManagementProject.Payload.Response.SummaryProjectResponse;
import com.ManagementProject.demoManagementProject.Repositories.ProjectRepository;
import com.ManagementProject.demoManagementProject.Repositories.TaskRepository;
import com.ManagementProject.demoManagementProject.Services.AnalyticsService;
import com.ManagementProject.demoManagementProject.Services.ProjectService;
import com.ManagementProject.demoManagementProject.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.swing.text.Document;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectService projectService;
    @Autowired
    private TaskService taskService;





    @Override
    public SummaryOverviewResponse getSummaryOverview(String email) {
        SummaryOverviewResponse summaryOverviewResponse = new SummaryOverviewResponse();
        SummaryProjectResponse summaryProjectResponse = projectService.getProjectSummary(email);
        // overview projects
        summaryOverviewResponse.setTotalProjects(summaryProjectResponse.getTotalProjects());
        summaryOverviewResponse.setCompletedProjects(summaryProjectResponse.getCompletedProjects());
        summaryOverviewResponse.setActiveProjects(summaryProjectResponse.getTotalProjects()-
                                                    (summaryProjectResponse.getCompletedProjects()
                                                            +summaryProjectResponse.getOverdueProjects()));
        double rate = 0.0;
        if (summaryProjectResponse.getTotalProjects() > 0) {
            rate = ((double) summaryProjectResponse.getCompletedProjects() / summaryProjectResponse.getTotalProjects()) * 100;
        }
        summaryOverviewResponse.setProjectCompletionRate(Math.round(rate * 10.0) / 10.0);
        // overview tasks
        summaryOverviewResponse.setTotalTasks(taskService.getTasksByAssigneeEmail(email).size());
        summaryOverviewResponse.setOngoingTasks(taskService.CountAllTaskWithStatus(email,"in progress"));
        summaryOverviewResponse.setCompletedTasks(taskService.CountAllTaskWithStatus(email,"completed"));
        double rateTask = 0.0;
        if (summaryOverviewResponse.getTotalTasks() > 0) {
            rateTask = ((double) summaryOverviewResponse.getCompletedTasks() / summaryOverviewResponse.getTotalTasks()) * 100;
        }
        summaryOverviewResponse.setTaskCompletionRate(Math.round(rateTask * 10.0) / 10.0);
        return summaryOverviewResponse;
    }
    public List<ProjectMonthlyStatsResponse> getProjectProgressOverview(String email) {
        List<Project> projects = projectRepository.findByProjectOwnerId(email);

        // Chuyển đổi dữ liệu thành thống kê theo tháng
        return mapToStatistics(projects);
    }

    @Override
    public List<ProjectStatusDistributionResponse> getProjectStatusDistribution(String email) {
        // Giả sử bạn muốn lấy tất cả project mà người dùng là thành viên
        List<Project> projects = projectRepository.findByMembersContains(email);

        // Nhóm theo status và đếm số lượng project theo từng trạng thái
        Map<String, Long> statusCountMap = projects.stream()
                .collect(Collectors.groupingBy(Project::getStatus, Collectors.counting()));

        // Tạo danh sách phản hồi
        List<ProjectStatusDistributionResponse> responseList = new ArrayList<>();
        for (Map.Entry<String, Long> entry : statusCountMap.entrySet()) {
            ProjectStatusDistributionResponse response = new ProjectStatusDistributionResponse();
            response.setName(entry.getKey());
            response.setValue(entry.getValue().intValue());
            responseList.add(response);
        }

        return responseList;
    }




    private List<ProjectMonthlyStatsResponse> mapToStatistics(List<Project> projects) {
        List<ProjectMonthlyStatsResponse> statistics = new ArrayList<>();

        // Mảng để lưu trữ số lượng dự án cho mỗi tháng (12 tháng trong năm)
        int[] completedProjectsPerMonth = new int[12];

        for (Project project : projects) {
            String startDate = project.getStartDate();  // Lấy ngày bắt đầu thay vì ngày kết thúc
            if (startDate != null && !startDate.isEmpty()) {
                // Lấy tháng từ startDate (yyyy-MM-dd)
                String month = startDate.split("-")[1];  // Chia tách theo dấu "-" và lấy phần tháng

                // Chuyển tháng từ string sang số nguyên và cộng số lượng dự án vào tháng tương ứng
                int monthIndex = Integer.parseInt(month) - 1; // Lưu ý tháng trong Java bắt đầu từ 0 (Jan = 0, Dec = 11)
                completedProjectsPerMonth[monthIndex]++;
            }
        }


        // Chuyển mảng thành danh sách kết quả để trả về
        for (int i = 0; i < 12; i++) {
            statistics.add(new ProjectMonthlyStatsResponse(getMonthName(i), completedProjectsPerMonth[i]));
        }

        return statistics;
    }

    // Phương thức lấy tên tháng dựa trên chỉ số tháng (0-11)
    private String getMonthName(int monthIndex) {
        String[] months = {
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        };
        return months[monthIndex];
    }

}
