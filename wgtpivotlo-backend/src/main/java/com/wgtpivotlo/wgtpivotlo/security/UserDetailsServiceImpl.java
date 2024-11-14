package com.wgtpivotlo.wgtpivotlo.security;


import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);

        if(user.isPresent()) {
            User existUser = user.get();
            log.warn(existUser.toString());
            UserDetailsImpl userDetails = UserDetailsImpl
                    .builder()
                    .email(existUser.getEmail())
                    .password(existUser.getPassword())
                    .role(existUser.getRole())
                    .build();
            return userDetails;
        }
        else{
            throw new UsernameNotFoundException("Username not found!");
        }
    }
}
