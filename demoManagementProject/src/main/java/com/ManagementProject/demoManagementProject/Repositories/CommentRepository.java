package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.Comment;
import com.ManagementProject.demoManagementProject.Models.ProjectFile;
import com.ManagementProject.demoManagementProject.Payload.Response.CommentResponse;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    Boolean existsByTaskId(String taskId);

    List<CommentResponse> findByTaskId(String taskId);

    Comment findByCommentId(String commentId);
    List<Comment> findByTaskIdAndUserEmail(String taskId, String userEmail);
    List<Comment> findByTaskIdOrderByCreatedAtAsc(String taskId);

    void deleteByCommentId(String commentId);
}
