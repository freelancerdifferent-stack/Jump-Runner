plugins {
    id("com.android.application")
}

android {
    namespace = "com.differentfreelancer.jumprunner"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.differentfreelancer.jumprunner"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}
