package com.unibuzzapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import androidx.core.view.WindowCompat

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Unibuzz"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Switch from SplashTheme to AppTheme and enable edge-to-edge so SafeArea can report insets.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    // Ensure we switch from SplashTheme to AppTheme
    setTheme(R.style.AppTheme)
    super.onCreate(savedInstanceState)

    // Draw behind system bars so react-native-safe-area-context can measure insets
    WindowCompat.setDecorFitsSystemWindows(window, false)
  }
}
