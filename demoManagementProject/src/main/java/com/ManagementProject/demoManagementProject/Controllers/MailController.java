package com.ManagementProject.demoManagementProject.Controllers;

import com.ManagementProject.demoManagementProject.DTOS.MailRequest;
import com.ManagementProject.demoManagementProject.Services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    @Autowired
    private MailService emailService;

    @GetMapping("/send-email")
    public String sendEmail() {
        try {
            emailService.sendSimpleEmail("trinhhd.23ns@vku.udn.vn",
                    "Test Subject",
                    "<h1>This is a test email</h1>");
            return "Email sent successfully!";
        } catch (Exception e) {
            return "Error sending email: " + e.getMessage();
        }
    }
    @PostMapping("/invite-mail")
    public void sendInviteEmail(@RequestBody MailRequest mailRequest) {
        try {
            emailService.sendSimpleEmail(
                    mailRequest.getTo(),
                    mailRequest.getSubject(),
                    mailRequest.getBody()
            );
        } catch (MailException e) {
            e.printStackTrace();
        }
    }
}
