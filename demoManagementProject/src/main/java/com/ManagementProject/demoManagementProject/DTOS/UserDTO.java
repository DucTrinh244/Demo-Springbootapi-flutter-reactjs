package com.ManagementProject.demoManagementProject.DTOS;


import lombok.Data;

@Data
public class UserDTO {
    private Long id;;
    private String name;
    private String email;
    private String password;
    private String phone;
}
