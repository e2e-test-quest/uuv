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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_url_with_uuv_assistant])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
