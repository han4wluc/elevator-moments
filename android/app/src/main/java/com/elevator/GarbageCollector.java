package com.elevator;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by lu on 15/01/17.
 */

public class GarbageCollector extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public GarbageCollector(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GarbageCollector";
    }

    @ReactMethod
    public void gc() {
//        Log.w("Garbage Collect", "Garbage Collect");
        System.gc();
    }
}