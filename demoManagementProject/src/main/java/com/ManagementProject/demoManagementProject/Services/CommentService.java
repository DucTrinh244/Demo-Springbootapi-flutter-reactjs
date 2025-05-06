package com.ManagementProject.demoManagementProject.Services;

import com.ManagementProject.demoManagementProject.Models.Comment;
import com.ManagementProject.demoManagementProject.Payload.Request.CommentRequest;
import com.ManagementProject.demoManagementProject.Payload.Response.CommentResponse;

import java.util.List;

public interface CommentService {
    void sendComment(String taskId, CommentRequest commentRequest, String userEmail);
    public List<CommentResponse> getCommentsByTaskId(String taskId) ;
}
