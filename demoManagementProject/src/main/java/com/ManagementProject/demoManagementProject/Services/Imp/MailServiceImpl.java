package com.ManagementProject.demoManagementProject.Services.Imp;

import com.ManagementProject.demoManagementProject.DTOS.MailRequest;
import com.ManagementProject.demoManagementProject.Services.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendSimpleEmail(String to, String subject, String body) throws MailException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, "utf-8");
            messageHelper.setTo(to);
            messageHelper.setSubject(subject);
            messageHelper.setText(body, true);  // Set true to indicate it's HTML
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void inviteMemberMail(String toEmail, String projectName, String invitationLink) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = "Invitation to join project: " + projectName;
            String body = "<h1>You've been invited to join project: " + projectName + "</h1>"
                    + "<p>Please click the link below to join:</p>"
                    + "<a href='" + invitationLink + "'>Join Project</a>"
                    + "<p>If you did not expect this invitation, you can ignore this email.</p>";

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true); // true: để gửi HTML content

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send invitation email", e);
        }
    }


}
