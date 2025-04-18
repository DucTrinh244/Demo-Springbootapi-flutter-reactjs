//package com.ManagementProject.demoManagementProject.Exception;
//
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.HttpRequestMethodNotSupportedException;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<CustomErrorResponse> handleAllExceptions(HttpServletRequest request, Exception ex) {
//        CustomErrorResponse error = new CustomErrorResponse(
//                "error",
//                ex.getMessage(),
//                request.getRequestURI()
//        );
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
//    public ResponseEntity<CustomErrorResponse> handleMethodNotSupported(HttpServletRequest request, HttpRequestMethodNotSupportedException ex) {
//        CustomErrorResponse error = new CustomErrorResponse(
//                "error",
//                "Phương thức không được hỗ trợ: " + ex.getMethod(),
//                request.getRequestURI()
//        );
//        return new ResponseEntity<>(error, HttpStatus.METHOD_NOT_ALLOWED);
//    }
//
//    @ExceptionHandler(AccessDeniedException.class)
//    public ResponseEntity<CustomErrorResponse> handleAccessDenied(HttpServletRequest request, AccessDeniedException ex) {
//        CustomErrorResponse error = new CustomErrorResponse(
//                "error",
//                "Bạn không có quyền truy cập tài nguyên này",
//                request.getRequestURI()
//        );
//        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
//    }
//}
