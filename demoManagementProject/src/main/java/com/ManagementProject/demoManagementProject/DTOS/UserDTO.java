package com.ManagementProject.demoManagementProject.DTOS;


import com.ManagementProject.demoManagementProject.Models.User;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class UserDTO {
    private String name;
    private String email;
    private String phone;

}
