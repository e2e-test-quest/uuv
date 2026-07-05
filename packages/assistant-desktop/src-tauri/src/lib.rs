use std::collections::HashMap;

#[tauri::command]
async fn open_url_with_uuv_assistant(url: String, app: tauri::AppHandle) {
    // Create initialization script that loads the external JS bundle
    let init_script = r#"
        (function() {
            function loadScript() {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@uuv/assistant@latest/dist/uuv-assistant-resources.bundle.js';
                script.onload = function() {
                    console.log('UUV script loaded successfully');
                };
                script.onerror = function() {
                    console.error('Failed to load UUV script');
                };
                (document.head || document.documentElement).appendChild(script);
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadScript);
            } else {
                loadScript();
            }
        })();
    "#;

    tauri::WebviewWindowBuilder::new(&app, "label", tauri::WebviewUrl::App(url.into()))
        .initialization_script(init_script)
        .inner_size(1280.0, 720.0)
        .title("UUV Assistant - Target app")
        .build()
        .unwrap();
}

#[tauri::command]
fn get_env_vars() -> HashMap<String, String> {
    std::env::vars().collect()
}

#[tauri::command]
fn kill_process_tree(pid: u32) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("taskkill")
            .args(["/PID", &pid.to_string(), "/T", "/F"])
            .output()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(not(target_os = "windows"))]
    {
        // Sur Unix, kill -9 sur le PID direct, ou mieux, gérer un process group
        std::process::Command::new("kill")
            .args(["-9", &pid.to_string()])
            .output()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![open_url_with_uuv_assistant, get_env_vars, kill_process_tree])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
