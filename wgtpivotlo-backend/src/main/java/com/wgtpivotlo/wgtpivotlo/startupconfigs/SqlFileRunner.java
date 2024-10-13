package com.wgtpivotlo.wgtpivotlo.startupconfigs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

@Component
@Order(3)
@Slf4j
public class SqlFileRunner implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SqlFileRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        // Read the SQL file
        String sql = Files.lines(Paths.get("src/main/resources/init-insert.sql"))
                .collect(Collectors.joining(" "));

        // Execute the SQL statements
        jdbcTemplate.execute(sql);

        log.info("init-insert.sql executed after DataLoader");
    }
}
