package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.Models.Comment;
import com.ManagementProject.demoManagementProject.Payload.Request.CommentRequest;
import com.ManagementProject.demoManagementProject.Payload.Response.CommentResponse;
import com.ManagementProject.demoManagementProject.Repositories.CommentRepository;
import com.ManagementProject.demoManagementProject.Services.CommentService;
import com.ManagementProject.demoManagementProject.Utils.CurrentUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentService commentService;

    @PostMapping("/send/{taskId}")
    public ResponseEntity<?> sendComment(
            @PathVariable String taskId,
            @RequestBody CommentRequest request) {
        String email = CurrentUserUtil.getCurrentUserEmail();


        commentService.sendComment(taskId, request, email);


        return ResponseEntity.ok("Comment sent successfully");
    }
    @GetMapping("/{taskId}")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable String taskId) {
        List<CommentResponse> comments = commentService.getCommentsByTaskId(taskId);

        return ResponseEntity.ok(comments);
    }

}
