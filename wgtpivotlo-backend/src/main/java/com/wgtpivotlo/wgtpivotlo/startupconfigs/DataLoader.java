package com.wgtpivotlo.wgtpivotlo.startupconfigs;

import com.wgtpivotlo.wgtpivotlo.enums.Role;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(2)
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        User adminUser = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin_password")) // Encoding the password
                .email("admin@example.com")
                .role(Role.ADMIN)
                .build();

        User normalUser = User.builder()
                .username("user")
                .password(passwordEncoder.encode("password")) // Encoding the password
                .email("user@example.com")
                .role(Role.USER)
                .build();

        try{
            // Save the users to the database
            userRepository.save(adminUser);
            userRepository.save(normalUser);
            log.info("New users have been added to database");
        } catch (Exception e) {
            log.info("Users are already in the database");
        }
    }
}
