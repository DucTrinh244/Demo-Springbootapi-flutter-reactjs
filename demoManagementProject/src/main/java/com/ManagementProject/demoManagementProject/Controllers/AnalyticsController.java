package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Payload.Response.SummaryOverviewResponse;
import com.ManagementProject.demoManagementProject.Services.AnalyticsService;
import com.ManagementProject.demoManagementProject.Utils.CurrentUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService   analyticsService;
    @GetMapping("/overview")
    public ResponseEntity<SummaryOverviewResponse> getSummaryOverview() {
        String email = CurrentUserUtil.getCurrentUserEmail();
        return ResponseEntity.ok(analyticsService.getSummaryOverview(email));

    }
    @GetMapping("/project-progress-overview")
    public ResponseEntity<List<?>> getProjectProgressOverview() {
        String email = CurrentUserUtil.getCurrentUserEmail();
        return ResponseEntity.ok(analyticsService.getProjectProgressOverview(email));
    }

    @GetMapping("/project-status-overview")
    public ResponseEntity<List<?>> getProjectStatusOverview() {
        String email = CurrentUserUtil.getCurrentUserEmail();
        return ResponseEntity.ok(analyticsService.getProjectStatusDistribution(email));
    }
}
