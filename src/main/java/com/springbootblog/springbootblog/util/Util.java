package com.springbootblog.springbootblog.util;

public class Util {

    private static ThreadLocal<Integer> currentUidContainer = new ThreadLocal<>();

    public static void setCurrentUid(int uid) {
        currentUidContainer.set(uid);
    }

    public static int getCurrentUid() {
        return currentUidContainer.get();
    }
}
