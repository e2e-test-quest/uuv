package com.e2etesting.uuv.intellijplugin.run.configuration

import com.e2etesting.uuv.intellijplugin.message.TechMessage
import com.e2etesting.uuv.intellijplugin.model.DEFAULT_TARGET_BROWSER
import com.e2etesting.uuv.intellijplugin.model.DEFAULT_TARGET_SCRIPT
import com.e2etesting.uuv.intellijplugin.model.DEFAULT_TARGET_TEST_FILE
import com.intellij.execution.configurations.RunConfigurationOptions
import com.intellij.openapi.components.StoredProperty

class UUVRunConfigurationOptions : RunConfigurationOptions() {
    private val projectHomeDirProperty: StoredProperty<String?> = string(null).provideDelegate(this, TechMessage.message("runconfiguration.option.property.name.projecthomedir"))
    private val useLocalScriptProperty: StoredProperty<Boolean> = property(false).provideDelegate(this, TechMessage.message("runconfiguration.option.property.name.uselocalscript"))
    private val targetScriptProperty: StoredProperty<String?> = string(DEFAULT_TARGET_SCRIPT.name).provideDelegate(this, TechMessage.message("runconfiguration.option.property.name.targetscript"))
    private val targetTestFileProperty: StoredProperty<String?> = string(DEFAULT_TARGET_TEST_FILE).provideDelegate(this, TechMessage.message("runconfiguration.option.property.name.targettestfile"))
    private val specificEnvironmentVariableProperty: StoredProperty<String?> = string(null).provideDelegate(this, TechMessage.message("runconfiguration.option.property.name.specificenvironmentvariable"))
    private val targetBrowserProperty: StoredProperty<String?> = string(DEFAULT_TARGET_BROWSER).provideDelegate(this, TechMessage.message("runconfiguration.option.property.name.targetbrowser"))

    var projectHomeDir: String?
        get() = projectHomeDirProperty.getValue(this)
        set(projectHomeDir) {
            projectHomeDirProperty.setValue(this, projectHomeDir)
        }

    var useLocalScript: Boolean
        get() = useLocalScriptProperty.getValue(this)
        set(useLocalScript) {
            useLocalScriptProperty.setValue(this, useLocalScript)
        }

    var targetScript: String?
        get() = targetScriptProperty.getValue(this)
        set(targetScript) {
            targetScriptProperty.setValue(this, targetScript)
        }

    var targetTestFile: String?
        get() = targetTestFileProperty.getValue(this)
        set(targetTestFile) {
            targetTestFileProperty.setValue(this, targetTestFile)
        }

    var specificEnvironmentVariable: String?
        get() = specificEnvironmentVariableProperty.getValue(this)
        set(specificPathVariable) {
            specificEnvironmentVariableProperty.setValue(this, specificPathVariable ?: "")
        }

    var targetBrowser: String?
        get() = targetBrowserProperty.getValue(this)
        set(targetBrowser) {
            targetBrowserProperty.setValue(this, targetBrowser)
        }
}

