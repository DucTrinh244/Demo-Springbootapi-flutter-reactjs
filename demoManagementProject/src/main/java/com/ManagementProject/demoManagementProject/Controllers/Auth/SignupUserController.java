//package com.ManagementProject.demoManagementProject.Controllers.Auth;
//
//
//import com.ManagementProject.demoManagementProject.DTOS.UserDTO;
//import com.ManagementProject.demoManagementProject.Payload.Request.SignupRequest;
//import com.ManagementProject.demoManagementProject.Services.AuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class SignupUserController {
//    @Autowired
//    private AuthService authService;
//
//    @PostMapping("/register")
//    public ResponseEntity<?> createUser(@RequestBody SignupRequest signupRequest){
//        UserDTO creatuser =authService.creatUser(signupRequest);
//        if(creatuser == null)
//            return new ResponseEntity<>("User is not created, try again ", HttpStatus.BAD_REQUEST);
//        return new ResponseEntity<>(creatuser,HttpStatus.CREATED);
//    }
//
//}
