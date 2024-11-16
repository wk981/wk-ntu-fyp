package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.LoginRequest;
import com.wgtpivotlo.wgtpivotlo.dto.RegisterRequest;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.UserExists;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Limit;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.wgtpivotlo.wgtpivotlo.enums.Role.USER;

@Service
@Slf4j
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // TODO: Add validations
    public void loginUser(HttpServletRequest request, LoginRequest loginRequest){
        log.warn("Building a token from login request");
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.getUsername(), loginRequest.getPassword());

        // Authenticate user, use UserDetails and compare password
        log.warn("Authenticating User");
        Authentication authentication = this.authenticationManager.authenticate(authenticationRequest);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        log.warn("Setting user principal");
        securityContext.setAuthentication(authentication); // Set user token in session
        log.warn("User Principal set");

        // Create a new session and add the security context.
        log.warn("Setting session");
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
        log.info("Session set");
    }

    // TODO: Add validations
    public void registerUser(RegisterRequest registerRequest) {
        log.warn("Searching for existing user");
        Optional<User> existUser = userRepository.findByUsernameOrEmail(registerRequest.getUsername(), registerRequest.getEmail(), Limit.of(1));

        if(existUser.isPresent()){
            throw new UserExists("Email or Username exists");
        }

        else{
            log.warn("User does not exist. Creating new user");
            User newUser = User
                    .builder()
                    .email(registerRequest.getEmail())
                    .role(USER)
                    .username(registerRequest.getUsername())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .build();
            userRepository.save(newUser);
            log.warn("New user created");
        }
    }

}
