package com.e2etesting.uuv.intellijplugin.inlayhint

import com.intellij.codeInsight.hints.declarative.*
import com.intellij.codeInsight.hints.declarative.InlayHintsCollector
import com.intellij.codeInsight.hints.declarative.InlayHintsProvider
import com.intellij.openapi.editor.Editor
import com.intellij.psi.*
import com.intellij.psi.PsiElement
import org.jetbrains.plugins.cucumber.psi.GherkinStep
import java.io.File
import java.util.regex.Pattern
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.ProjectManager
import kotlin.collections.get

class UUVVariableInlayHintProvider : InlayHintsProvider {
    private val logger = Logger.getInstance(UUVVariableInlayHintProvider::class.java)


    override fun createCollector(file: PsiFile, editor: Editor): InlayHintsCollector {
        return object : SharedBypassCollector {

            private fun getNestedValue(map: Map<String, Any>, path: String): String? {
                val keys = path.split(".")
                var current: Any? = map
                for (key in keys) {
                    if (current is Map<*, *>) {
                        current = current[key]
                    } else {
                        return null
                    }
                }
                return current as? String
            }

            private fun loadVariablesFromJson(): Map<String, Any> {
                val projectRootDir = ProjectManager.getInstance().openProjects.firstOrNull()
                val jsonFile = File("${projectRootDir!!.basePath}/variables.json")
                if (!jsonFile.exists()) return emptyMap()

                return try {
                    val gson = Gson()
                    val type = object : TypeToken<Map<String, Any>>() {}.type
                    gson.fromJson(jsonFile.readText(), type)
                } catch (e: Exception) {
                    logger.error("Erreur lors du parsing du fichier JSON : ${e.message}", e)
                    emptyMap()
                }
            }

            override fun collectFromElement(element: PsiElement, sink: InlayTreeSink) {
                if (element !is GherkinStep) return

                val stepText = element.text
                val pattern = Pattern.compile("\\$\\{([^}]+)\\}")
                val matcher = pattern.matcher(stepText)
                val variableMap: Map<String, Any> = loadVariablesFromJson()

                while (matcher.find()) {
                    val variableName = matcher.group(1)
                    val variableValue = getNestedValue(variableMap, variableName)
                    if (variableValue != null) {
                        val startOffset = element.textOffset + matcher.start()
                        val endOffset = element.textOffset + matcher.end()

                        sink.addPresentation(
                            InlineInlayPosition(element.textOffset + matcher.end(), true),
                            hasBackground = true
                        ) {
                            text("${variableValue}")
                        }
                    }
                }
            }
        }
    }
}