package com.example.backend;

// CloudinaryConfig.java
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {

        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dgviukhwt",
                "api_key", "175449846411981",
                "api_secret", "bySJIFWTW68WagDIbme-gcjDsNI"));
        return cloudinary;
    }
}
