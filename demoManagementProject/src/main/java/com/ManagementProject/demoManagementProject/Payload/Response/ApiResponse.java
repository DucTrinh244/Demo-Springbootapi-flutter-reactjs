package com.ManagementProject.demoManagementProject.Payload.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class ApiResponse<T> {
    private String status;
    private String message;
    private LocalDateTime timestamp;
    private T data;

    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.data = data;
    }

}
