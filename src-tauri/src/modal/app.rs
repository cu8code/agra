use crate::logger;

use gio::prelude::*;
use gio::{self, AppInfo};
use serde::{Deserialize, Serialize};
use simsearch::SimSearch;
use std::collections::HashMap;

// Define a struct for application details
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppDetails {
    t: String,
    name: String,
    app_id: String,
    icon_path: String,
    description: Option<String>,
}

// Function to list available applications
pub fn list_available_apps() -> HashMap<String, AppDetails> {
    let mut apps = HashMap::new();
    let app_info_list = AppInfo::get_all();

    logger::log("Listing available applications..."); // Log the start of the process

    for app_info in app_info_list {
        if let (Some(name), Some(app_id), Some(icon)) = (
            app_info.get_display_name(),
            app_info.get_id(),
            app_info.get_icon(),
        ) {
            let icon_path = gio::IconExt::to_string(&icon).unwrap().to_string();
            let description = app_info.get_description().map(|s| s.to_string());
            let details = AppDetails {
                name: name.to_string(),
                icon_path,
                description,
                t: "app_details".to_string(),
                app_id: app_id.to_string(),
            };
            apps.insert(app_id.to_string(), details);
            logger::log(&format!("Found application: {} (ID: {})", name, app_id)); // Log each found application
        }
    }

    logger::log(&format!("Total applications found: {}", apps.len())); // Log the total number of applications found
    apps
}

// Tauri command to query applications based on a search string
#[tauri::command]
pub fn query_app(query: &str) -> Vec<AppDetails> {
    logger::log(&format!("Querying applications for: {}", query)); // Log the query

    let apps = list_available_apps(); // Get all available apps
    let mut matched_apps = Vec::new();

    // Create a SimSearch engine
    let mut engine: SimSearch<String> = SimSearch::new();

    // Insert app names into the search engine
    for (app_id, details) in &apps {
        engine.insert(app_id.clone(), &details.name);
    }

    // Perform the search using simsearch
    let results: Vec<String> = engine.search(query);

    // Collect matched apps based on the search results
    for app_id in results {
        if let Some(app) = apps.get(&app_id) {
            matched_apps.push(app.clone());
            logger::log(&format!("Matched application: {} (ID: {})", app.name, app.app_id)); // Log each matched application
        }
    }

    logger::log(&format!("Total matched applications: {}", matched_apps.len())); // Log the total number of matches

    matched_apps
}
