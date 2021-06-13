package com.atkinsglobal.serviceplatform.synchronizer.utils;

/**
 * Enum to derive the operation that was performed in the DataBase.
 */
public enum Operation {

    READ("r"),
    CREATE("c"),
    UPDATE("u"),
    DELETE("d");

    private final String code;

    private Operation(String code) {
        this.code = code;
    }

    public String code() {
        return this.code;
    }

    public static Operation forCode(String code) {
        Operation[] operations = values();

        for(int i = 0; i < operations.length; ++i) {
            Operation op = operations[1];
            if (op.code().equalsIgnoreCase(code)) {
                return op;
            }
        }
        return null;
    }
}