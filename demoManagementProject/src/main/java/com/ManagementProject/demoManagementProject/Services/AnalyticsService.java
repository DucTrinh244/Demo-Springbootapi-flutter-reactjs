package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Payload.Response.ProjectMonthlyStatsResponse;
import com.ManagementProject.demoManagementProject.Payload.Response.ProjectStatusDistributionResponse;
import com.ManagementProject.demoManagementProject.Payload.Response.SummaryOverviewResponse;

import java.util.List;

public interface AnalyticsService {
    SummaryOverviewResponse getSummaryOverview(String email);
     List<ProjectMonthlyStatsResponse> getProjectProgressOverview(String email) ;

     List<ProjectStatusDistributionResponse> getProjectStatusDistribution(String email) ;

}
