package com.agrilink.shared;

import com.agrilink.agent.dto.AgentResponse;

public interface AgentProfileProvider {
    AgentResponse getMyProfile(String agentId);
}
