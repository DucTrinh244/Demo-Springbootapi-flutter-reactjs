package com.ManagementProject.demoManagementProject.Payload.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class MessageRequest {
    private String content;
    private String sender;
    private String roomId;

}
