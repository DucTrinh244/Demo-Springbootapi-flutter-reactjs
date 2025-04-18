package com.ManagementProject.demoManagementProject.Payload.Response;

import com.ManagementProject.demoManagementProject.DTOS.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private String jwt;

}
