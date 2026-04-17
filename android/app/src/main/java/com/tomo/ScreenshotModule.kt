package com.tomo

import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class ScreenshotModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ScreenshotModule"

    @ReactMethod
    fun forbid(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                currentActivity?.window?.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
                promise.resolve("locked")
            } catch (e: Exception) {
                promise.reject("ERR", e)
            }
        }
    }

    @ReactMethod
    fun allow(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                currentActivity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                promise.resolve("unlocked")
            } catch (e: Exception) {
                promise.reject("ERR", e)
            }
        }
    }
}