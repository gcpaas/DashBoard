package com.gccloud.dashboard;

import com.github.benmanes.caffeine.cache.AsyncCache;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * @author hongyang
 * @version 1.0
 * @date 2023/6/14 16:17
 */
@Slf4j
@RestController
@RequestMapping("/test")
public class TestController {

    AsyncCache<String, String> CACHE_TEST = Caffeine.newBuilder().expireAfterWrite(1, TimeUnit.MINUTES).buildAsync();


    @GetMapping("/test1")
    public String test() {
        CompletableFuture<String> future = CACHE_TEST.get("test", key -> {
            // 睡眠1秒
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            log.info("触发缓存回调");
            return "test";
        });
        // 阻塞获取结果
        return future.join();
    }

}
