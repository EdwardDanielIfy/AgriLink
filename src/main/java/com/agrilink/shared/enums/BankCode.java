package com.agrilink.shared.enums;

import lombok.Getter;

@Getter
public enum BankCode {

    ACCESS_BANK("Access Bank", "044"),
    FIRST_BANK("First Bank", "011"),
    GTBANK("GTBank", "058"),
    ZENITH_BANK("Zenith Bank", "057"),
    UBA("UBA", "033"),
    UNION_BANK("Union Bank", "032"),
    STERLING_BANK("Sterling Bank", "232"),
    FIDELITY_BANK("Fidelity Bank", "070"),
    ECOBANK("Ecobank", "050"),
    FCMB("FCMB", "214"),
    STANBIC_IBTC("Stanbic IBTC", "221"),
    WEMA_BANK("Wema Bank", "035"),
    HERITAGE_BANK("Heritage Bank", "030"),
    KEYSTONE_BANK("Keystone Bank", "082"),
    POLARIS_BANK("Polaris Bank", "076"),
    PROVIDUS_BANK("Providus Bank", "101"),
    JAIZ_BANK("Jaiz Bank", "301"),
    KUDA_BANK("Kuda Bank", "090267"),
    OPAY("OPay", "999992"),
    PALMPAY("PalmPay", "999991"),
    MONIEPOINT("Moniepoint", "090405");

    private final String displayName;
    private final String code;

    BankCode(String displayName, String code) {
        this.displayName = displayName;
        this.code = code;
    }

    public static BankCode fromDisplayName(String displayName) {
        for (BankCode bank : values()) {
            if (bank.displayName.equalsIgnoreCase(displayName)) {
                return bank;
            }
        }
        throw new IllegalArgumentException("Unknown bank: " + displayName);
    }
}