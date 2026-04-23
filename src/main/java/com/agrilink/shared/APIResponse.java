package com.agrilink.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class APIResponse {

        private boolean success;
        private Object data;

//        public ApiResponse(boolean success, Object data) {
//            this.success = success;
//            this.data = data;
//        }


    }

