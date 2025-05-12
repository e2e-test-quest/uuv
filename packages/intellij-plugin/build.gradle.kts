plugins {
  id("java")
  id("org.jetbrains.kotlin.jvm") version "1.9.25"
  id("org.jetbrains.intellij") version "1.17.4"
}

group = "com.e2e-testing.uuv"

repositories {
  mavenCentral()
}

dependencies {
  implementation("com.google.code.gson:gson:2.11.0")
}

// Configure Gradle IntelliJ Plugin
// Read more: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html
intellij {
  version.set("2023.3.8")
  type.set("IC") // Target IDE Platform

  plugins.set(listOf("gherkin:233.11799.165"))
}

tasks {
  // Set the JVM compatibility versions
  withType<JavaCompile> {
    sourceCompatibility = "17"
    targetCompatibility = "17"
  }
  withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions.jvmTarget = "17"
  }

  patchPluginXml {
    sinceBuild.set("222")
    untilBuild.set("")
  }

  signPlugin {
    certificateChain.set(providers.environmentVariable("UUV_CERTIFICATE_CHAIN"))
    privateKey.set(providers.environmentVariable("UUV_PRIVATE_KEY"))
    password.set(providers.environmentVariable("UUV_PRIVATE_KEY_PASSWORD"))
    inputArchiveFile.set(file(buildPlugin.get().archiveFileName))
  }

  publishPlugin {
    token.set(providers.environmentVariable("UUV_PUBLISH_TOKEN"))
  }
}
