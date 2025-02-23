package com.e2etesting.uuv.intellijplugin.model

enum class UUVTargetScript {
    open,
    e2e
}

public val DEFAULT_TARGET_SCRIPT = UUVTargetScript.e2e

public val DEFAULT_TARGET_TEST_FILE = null

public const val DEFAULT_TARGET_BROWSER = "chrome"
