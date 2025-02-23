package com.e2etesting.uuv.intellijplugin.run.configuration

import com.e2etesting.uuv.intellijplugin.UUVUtils
import com.e2etesting.uuv.intellijplugin.message.TechMessage
import com.e2etesting.uuv.intellijplugin.message.UiMessage
import com.e2etesting.uuv.intellijplugin.model.DEFAULT_TARGET_BROWSER
import com.e2etesting.uuv.intellijplugin.model.UUVTargetScript
import com.e2etesting.uuv.intellijplugin.run.console.UUVConsoleProperties
import com.intellij.execution.DefaultExecutionResult
import com.intellij.execution.ExecutionException
import com.intellij.execution.ExecutionResult
import com.intellij.execution.Executor
import com.intellij.execution.configurations.*
import com.intellij.execution.process.*
import com.intellij.execution.runners.ExecutionEnvironment
import com.intellij.execution.runners.ProgramRunner
import com.intellij.execution.testframework.sm.SMTestRunnerConnectionUtil
import com.intellij.execution.testframework.sm.runner.*
import com.intellij.openapi.options.SettingsEditor
import com.intellij.openapi.project.Project
import io.ktor.utils.io.charsets.*
import org.jetbrains.annotations.Nls


class UUVRunConfiguration(project: Project?, factory: ConfigurationFactory?, name: String?) : RunConfigurationBase<UUVRunConfigurationOptions?>(project!!, factory, name) {
    override fun getOptions(): UUVRunConfigurationOptions {
        return super.getOptions() as UUVRunConfigurationOptions
    }

    var projectHomeDir: String?
        get() = options.projectHomeDir
        set(projectHomeDir) {
            options.projectHomeDir = projectHomeDir
        }

    var useLocalScript: Boolean
        get() = options.useLocalScript
        set(useLocalScript) {
            options.useLocalScript = useLocalScript
        }

    var targetScript: String?
        get() = options.targetScript
        set(targetScript) {
            options.targetScript = targetScript
        }

    var targetTestFile: String?
        get() = options.targetTestFile
        set(targetTestFile) {
            options.targetTestFile = targetTestFile
        }

    var specificEnvironmentVariable: String?
        get() = options.specificEnvironmentVariable
        set(specificEnvironmentVariable) {
            options.specificEnvironmentVariable = specificEnvironmentVariable
        }

    var targetBrowser: String?
        get() = options.targetBrowser
        set(targetBrowser) {
            options.targetBrowser = targetBrowser
        }

    override fun getConfigurationEditor(): SettingsEditor<out UUVRunConfiguration?> {
        return UUVRunSettingsEditor()
    }

    override fun checkConfiguration() {
        if(projectHomeDir.isNullOrBlank()) {
            val field = UiMessage.message("runconfiguration.field.chooseproject.label")
            throw RuntimeConfigurationError(UiMessage.message("runconfiguration.check.error.required", field))
        }
        if(targetScript.isNullOrBlank()) {
            val field = UiMessage.message("runconfiguration.field.targetscript.label")
            throw RuntimeConfigurationError(UiMessage.message("runconfiguration.check.error.required", field))
        }
    }

    override fun getState(executor: Executor, executionEnvironment: ExecutionEnvironment): RunProfileState {
        return object : CommandLineState(executionEnvironment) {

            override fun execute(executor: Executor, runner: ProgramRunner<*>): ExecutionResult {
                val properties = UUVConsoleProperties(this@UUVRunConfiguration, UiMessage.message("runconfiguration.framework.name"), executor)
                val processHandler: ProcessHandler = startProcess()
                val uuvConsole = SMTestRunnerConnectionUtil.createAndAttachConsole(UiMessage.message("runconfiguration.framework.name"), processHandler, properties)
                return DefaultExecutionResult(uuvConsole, processHandler)
            }

            @Throws(ExecutionException::class)
            override fun startProcess(): ProcessHandler {
                val commandLine = getCommandLineToExecute()
                        .withEnvironment(getEnvironmentVariable())
                        .withWorkDirectory(
                                if(this@UUVRunConfiguration.projectHomeDir != null)
                                    this@UUVRunConfiguration.projectHomeDir
                                else executionEnvironment.project.basePath
                        )
                        .withCharset(Charset.forName(TechMessage.message("charset")))
                val processHandler = ProcessHandlerFactory.getInstance().createColoredProcessHandler(commandLine)
                ProcessTerminatedListener.attach(processHandler)
                return processHandler
            }

            private fun getCommandLineToExecute(): GeneralCommandLine {
                val envParameter = TechMessage.message("cmd.parameter.teamcity.enable")
                val parameters: MutableList<String> = arrayOf(envParameter).toMutableList()

                if(this@UUVRunConfiguration.targetTestFile != null) {
                    parameters.add(TechMessage.message("cmd.parameter.targettestfile",
                        this@UUVRunConfiguration.targetTestFile!!
                    ))
                }

                if(this@UUVRunConfiguration.targetScript != UUVTargetScript.open.toString()) {
                    val browser = if(this@UUVRunConfiguration.targetBrowser != null)
                                    this@UUVRunConfiguration.targetBrowser!!
                                  else
                                    DEFAULT_TARGET_BROWSER
                    parameters.add(TechMessage.message("cmd.parameter.targetbrowser", browser))
                }

                return if (!useLocalScript) {
                    GeneralCommandLine(getNpxCommand(), TechMessage.message("cmd.executor.run.uuv"), targetScript, *parameters.toTypedArray())
                } else {
                    GeneralCommandLine(getNpmCommand(), TechMessage.message("cmd.executor.run"), TechMessage.message("cmd.executor.run.uuv"), "${targetScript}", TechMessage.message("cmd.executor.passvariable"), *parameters.toTypedArray())
                }
            }

            fun getEnvironmentVariable(): Map<String, String?> {
                val specificEnvironmentVariableMap: Map<String, String> = UUVUtils.toMap(specificEnvironmentVariable)
                return specificEnvironmentVariableMap.ifEmpty { getSystemPathVariable() }
            }

            fun getSystemPathVariable(): Map<@Nls String, String?> {
                return mapOf(Pair<@Nls String, String?>(TechMessage.message("system.env.path"), System.getenv(TechMessage.message("system.env.path"))))
            }

            fun getNpxCommand(): String = if(UUVUtils.isWindows(UUVUtils.getOs())) TechMessage.message("cmd.executor.npx.win") else TechMessage.message("cmd.executor.npx.unix")

            fun getNpmCommand(): String = if(UUVUtils.isWindows(UUVUtils.getOs())) TechMessage.message("cmd.executor.npm.win") else TechMessage.message("cmd.executor.npm.unix")
        }
    }
}
