package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.LoginRequest;
import com.wgtpivotlo.wgtpivotlo.dto.RegisterRequest;
import com.wgtpivotlo.wgtpivotlo.dto.UserDTO;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.UserExists;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Limit;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public UserDTO getUser(Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        List<String> roles = authorities.stream().map(Object::toString).collect(Collectors.toList());

        long userId = userDetails.getId();
        Optional<User> existingUser = userRepository.findById(userId);
        existingUser.orElseThrow(() -> new ResourceNotFoundException("User is not found"));
        User user = existingUser.get();

        Boolean isCareerPreferenceSet = user.getCareerId() != null;

        return UserDTO
                .builder()
                .id(user.getUser_id())
                .username(user.getUsername())
                .email(user.getEmail())
                .pic(user.getPic())
                .role(roles)
                .isCareerPreferenceSet(isCareerPreferenceSet)
                .build();
    }

}
