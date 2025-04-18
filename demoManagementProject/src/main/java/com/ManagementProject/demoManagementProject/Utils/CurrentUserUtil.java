package com.ManagementProject.demoManagementProject.Utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentUserUtil {
    // Trả về email hoặc username hiện tại từ JWT
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // thường là email hoặc username
        }
        return null;
    }
}
