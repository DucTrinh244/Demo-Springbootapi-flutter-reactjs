package com.ManagementProject.demoManagementProject.DTOS;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class MailRequest {
    private String to;
    private String subject;
    private String body;
}
