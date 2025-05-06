package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.Models.Comment;
import com.ManagementProject.demoManagementProject.Models.User;
import com.ManagementProject.demoManagementProject.Payload.Request.CommentRequest;
import com.ManagementProject.demoManagementProject.Payload.Response.CommentResponse;
import com.ManagementProject.demoManagementProject.Repositories.CommentRepository;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import com.ManagementProject.demoManagementProject.Services.CommentService;
import com.ManagementProject.demoManagementProject.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskService taskService;



    @Override
    public void sendComment(String taskId, CommentRequest commentRequest, String userEmail) {
       if( taskService.checkSendMailInTask(taskId, userEmail)) {
           Comment comment = new Comment();
           comment.setTaskId(taskId);
           comment.setUserEmail(userEmail);
           comment.setCommentText(commentRequest.getCommentText());
           comment.setCreatedAt(LocalDateTime.now());

           commentRepository.save(comment);
       }
       else {
           throw new RuntimeException("You are not allowed to comment on this task");
       }
    }

    @Override
    public List<CommentResponse> getCommentsByTaskId(String taskId) {
        List<Comment> comments = commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId);

        return comments.stream().map(comment -> {
            String email = comment.getUserEmail();
            User user = userRepository.findByEmail(email);
            String author = (user != null) ? user.getName() : "Unknown";

            CommentResponse response = new CommentResponse();
            response.setCommentId(comment.getCommentId());
            response.setUserEmail(email);
            response.setAuthor(author);
            response.setCommentText(comment.getCommentText());
            response.setCreatedAt(comment.getCreatedAt());

            return response;
        }).collect(Collectors.toList());
    }
}