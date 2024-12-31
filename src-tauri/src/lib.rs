mod modal;
mod logger;

use tauri::{AppHandle, Manager};

use gio::AppInfoExt;
use gio::DesktopAppInfoExt;
use gio::{self, DesktopAppInfo};
use std::env;
use std::path::Path;
use std::process::{Command, Stdio};

static mut WINDOW_VISIBLE: bool = true; // Track window visibility state

#[tauri::command]
fn launch_application(desktop_entry_id: &str) -> bool {
    let app_id = if desktop_entry_id.ends_with(".desktop") {
        Path::new(desktop_entry_id)
            .file_stem()
            .unwrap()
            .to_str()
            .unwrap()
    } else {
        desktop_entry_id
    };

    logger::log(&format!("Attempting to launch application: {}", app_id));

    if let Some(app_info) = DesktopAppInfo::new(desktop_entry_id) {
        let exec_command = app_info.get_commandline().unwrap_or_default();
        let stripped_cmd = exec_command
            .to_str()
            .unwrap_or_default()
            .replace("%f", "")
            .replace("%u", "");

        let success = if app_info.get_boolean("DBusActivatable") {
            let command = format!("gapplication launch {}", app_id);
            Command::new("sh").arg("-c").arg(command).spawn().is_ok()
        } else {
            Command::new("sh")
                .arg("-c")
                .arg(stripped_cmd)
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
                .is_ok()
        };

        if success {
            logger::log(&format!("Successfully launched application: {}", app_id));
            // Append to history file
            modal::history::append_to_history(&format!("{}", app_id), &"app_details".to_string());
        } else {
            logger::log(&format!("Failed to launch application: {}", app_id));
        }

        return success;
    }

    false
}

#[tauri::command]
fn open_website(url: String) -> Result<(), String> {
    if !url.starts_with("http://") && !url.starts_with("https://") {
        return Err("Invalid URL format. Must start with http:// or https://".to_string());
    }

    logger::log(&format!("Opening website: {}", url));

    let command = if cfg!(target_os = "windows") {
        format!("start {}", url)
    } else if cfg!(target_os = "macos") {
        format!("open {}", url)
    } else {
        format!("xdg-open {}", url)
    };

    Command::new("sh")
        .arg("-c")
        .arg(command)
        .output()
        .map_err(|e| format!("Failed to open website: {}", e))?;

    // Append to history file
    modal::history::append_to_history(&format!("{}", url), &"url".to_string());

    logger::log(&format!("Successfully opened website: {}", url));

    Ok(())
}

#[tauri::command]
fn toggle_window(app_handle: AppHandle) {
    unsafe {
        if let Some(window) = app_handle.get_webview_window("main") {
            if WINDOW_VISIBLE {
                window.hide().unwrap();
                WINDOW_VISIBLE = false; // Update state to hidden
                logger::log("Window hidden.");
            } else {
                window.show().unwrap();
                WINDOW_VISIBLE = true; // Update state to visible
                logger::log("Window shown.");
            }
        }
    }
}

#[tauri::command]
fn show_window(app_handle: AppHandle) {
    unsafe {
        if let Some(window) = app_handle.get_webview_window("main") {
            window.show().unwrap();
            WINDOW_VISIBLE = true; // Update state to visible
            logger::log("Window shown.");
        }
    }
}

#[tauri::command]
fn hide_window(app_handle: AppHandle) {
    unsafe {
        if let Some(window) = app_handle.get_webview_window("main") {
            window.hide().unwrap();
            WINDOW_VISIBLE = false; // Update state to hidden
            logger::log("Window hidden.");
        }
    }
}

fn get_version() -> String {
    let version = env!("CARGO_PKG_VERSION");
    let git_hash = option_env!("GIT_HASH").unwrap_or("unknown");
    format!("{}.{}", version, git_hash)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    logger::init();

    // Check for command-line arguments before initializing GTK
    let args: Vec<String> = std::env::args().collect();
    if args.len() >= 2 {
        if args[1] == "v" || args[1] == "version" {
            let version_info = get_version();
            println!("{}", version_info);
            return; // Exit after printing version
        }
    }

    // Initialize GTK
    if gtk::init().is_err() {
        eprintln!("Failed to initialize GTK.");
        return;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            #[cfg(desktop)]
            if let Some(window) = app.get_webview_window("main") {
                handle_command(app.clone(), args);
                window.set_focus().unwrap();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            modal::app::query_app,
            modal::emoji::query_emojis,
            modal::icon::query_icons,
            modal::history::query_history,
            toggle_window,
            show_window,
            hide_window,
            launch_application,
            open_website,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn handle_command(app: AppHandle, args: Vec<String>) {
    #[cfg(desktop)]
    if let Some(window) = app.get_webview_window("main") {
        if args.len() >= 2 {
            match args[1].as_str() {
                "hidden" => hide_window(app.clone()),
                "show" => show_window(app.clone()),
                "toggle" => toggle_window(app.clone()),
                _ => show_window(app.clone()), // Default action
            }
        } else {
            show_window(app.clone());
        }
    }
}
