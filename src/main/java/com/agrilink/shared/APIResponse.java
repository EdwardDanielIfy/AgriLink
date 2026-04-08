package com.agrilink.shared;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
    @AllArgsConstructor
    public class APIResponse {

        private boolean success;
        private Object data;

//        public ApiResponse(boolean success, Object data) {
//            this.success = success;
//            this.data = data;
//        }


    }

