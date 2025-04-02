//package com.ManagementProject.demoManagementProject.Controllers.Auth;
//import com.ManagementProject.demoManagementProject.Payload.Request.AuthenticationRequest;
//import com.ManagementProject.demoManagementProject.Payload.Response.AuthenticationResponse;
//import com.ManagementProject.demoManagementProject.Utils.JwtUtil;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.DisabledException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.IOException;
//
//@RestController
//public class AuthenticationController {
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @PostMapping("/authentication")
//    public AuthenticationResponse createAuthenticationResponse(
//            @RequestBody AuthenticationRequest authenticationRequest,
//            HttpServletResponse Response
//    ) throws BadCredentialsException, DisabledException, UsernameNotFoundException, IOException{
//        try {
//            authenticationManager
//                    .authenticate(new UsernamePasswordAuthenticationToken(
//                            authenticationRequest.getEmail(),
//                            authenticationRequest.getPassword()
//                    ));
//        } catch (BadCredentialsException e){
//            throw  new BadCredentialsException("Incorrect username and password");
//        }catch (DisabledException disabledException){
//            Response.sendError(HttpServletResponse.SC_NOT_FOUND,"User is not created. Register User first");
//            return null;
//        }
//        final UserDetails userDetails= userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
//        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
//        return new AuthenticationResponse(jwt);
//    }
//}
