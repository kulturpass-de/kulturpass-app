package de.bkm.kulturpass.custom

import android.content.res.Configuration
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class KPCustomModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return NAME
    }

    companion object {
        const val NAME = "KPCustomModule"
    }

    @ReactMethod
    fun isBoldTextEnabled(promise: Promise) {
        val config: Configuration = reactApplicationContext.resources.configuration

        val fontWeight = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            config.fontWeightAdjustment
        } else {
            null
        }

        promise.resolve(fontWeight)
    }
}