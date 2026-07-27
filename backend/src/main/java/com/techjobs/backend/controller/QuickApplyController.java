package com.techjobs.backend.controller;

import com.techjobs.backend.dto.QuickApplyDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.QuickApplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class QuickApplyController {

    private final QuickApplyService quickApplyService;

    @PostMapping("/{jobId}/quick-apply")
    public ResponseEntity<QuickApplyDTO.Response> quickApply(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long jobId,
            @RequestBody(required = false) QuickApplyDTO.Request request) {
        QuickApplyDTO.Response response = quickApplyService.quickApply(user.getUser().getId(), jobId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
