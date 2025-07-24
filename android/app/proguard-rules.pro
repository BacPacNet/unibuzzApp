# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Retrofit
-keep class retrofit2.** { *; }
-dontwarn retrofit2.**

# OkHttp
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

# Gson (if you use it)
-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

# Required for Retrofit annotations
-keepattributes Signature
-keepattributes *Annotation*

# If you use models for JSON parsing:
-keep class com.unibuzzapp.models.** { *; }

# Keep your API interface
-keep interface com.unibuzzapp.network.** { *; }

