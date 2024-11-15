package com.wgtpivotlo.wgtpivotlo.security;


import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.warn("Fetching user from database");
        Optional<User> user = userRepository.findByUsername(username);

        if(user.isPresent()) {
            log.warn("User found");
            User existUser = user.get();
            log.warn("Building a userDetails");
            UserDetailsImpl userDetails = UserDetailsImpl
                    .builder()
                    .email(existUser.getEmail())
                    .password(existUser.getPassword())
                    .username(existUser.getUsername())
                    .role(existUser.getRole())
                    .build();
            return userDetails;
        }
        else{
            log.error("User does not exist");
            throw new UsernameNotFoundException("Username not found!");
        }
    }
}
