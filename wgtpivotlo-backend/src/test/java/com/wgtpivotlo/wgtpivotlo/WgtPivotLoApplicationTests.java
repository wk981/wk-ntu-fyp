package com.wgtpivotlo.wgtpivotlo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.username=sa",
    "spring.datasource.password=password",
	"spring.datasource.driver-class-name=org.h2.Driver"
})
class WgtPivotLoApplicationTests {

	@Test
	void contextLoads() {
	}

}
