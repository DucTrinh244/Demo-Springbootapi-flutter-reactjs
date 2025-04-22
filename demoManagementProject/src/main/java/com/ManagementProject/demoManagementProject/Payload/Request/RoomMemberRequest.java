package com.ManagementProject.demoManagementProject.Payload.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomMemberRequest {
    String roomName;
    String userEmail;
    private List<String> members= new ArrayList<>();
}
