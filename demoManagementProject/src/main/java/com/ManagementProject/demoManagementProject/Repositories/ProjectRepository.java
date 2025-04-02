package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends MongoRepository<Project, String> {
    // Tìm kiếm dự án theo projectId
    Optional<Project> findByProjectId(String projectId);

    // Tìm kiếm dự án theo tên dự án
    List<Project> findByProjectName(String projectName);

    // Tìm kiếm dự án theo trạng thái
    List<Project> findByStatus(String status);

    // Tìm kiếm dự án theo chủ sở hữu (projectOwnerId)
    List<Project> findByProjectOwnerId(String projectOwnerId);

    // Tìm kiếm dự án có chứa thành viên trong danh sách members
    List<Project> findByMembersContains(String memberId);}
