package com.ManagementProject.demoManagementProject.Services;

public interface MailService {
     void sendSimpleEmail(String to, String subject, String body);
     void inviteMemberMail(String toEmail, String projectName, String invitationLink);
}