package com.techjobs.backend.service;

import com.techjobs.backend.dto.QuickApplyDTO;

public interface QuickApplyService {
    QuickApplyDTO.Response quickApply(Long userId, Long jobId, QuickApplyDTO.Request request);
}
