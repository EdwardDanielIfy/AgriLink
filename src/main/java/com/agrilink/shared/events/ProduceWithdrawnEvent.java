package com.agrilink.shared.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ProduceWithdrawnEvent extends ApplicationEvent {

        private final String produceId;
        private final String farmerId;

        public ProduceWithdrawnEvent(Object source, String produceId, String farmerId) {
            super(source);
            this.produceId = produceId;
            this.farmerId = farmerId;
        }

}