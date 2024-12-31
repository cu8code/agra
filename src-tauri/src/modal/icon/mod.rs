pub mod icon_index;

use serde::{Deserialize, Serialize};
use simsearch::SimSearch;

use icon_index::ICONS;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct IconDetails {
    name: String,
    svg: String,
    t: String,
}

#[tauri::command]
pub fn query_icons(query: &str) -> Vec<IconDetails> {
    // Collect all icons into a vector
    let icons: Vec<IconDetails> = ICONS
        .iter()
        .map(|(name, _desc, icon)| IconDetails {
            name: name.to_string(),
            svg: icon.data.to_string(),
            t: "icon_details".to_string(),
        })
        .collect();

    // Create a SimSearch engine
    let mut engine: SimSearch<String> = SimSearch::new();

    // Insert icon names into the search engine
    for (index, icon) in icons.iter().enumerate() {
        engine.insert(index.to_string(), &icon.name.clone());
    }

    // Perform the search using simsearch
    let results: Vec<String> = engine.search(query);

    // Collect matched icons based on the search results
    let matched_icons: Vec<IconDetails> = results
        .iter()
        .filter_map(|index| {
            let idx = index.parse::<usize>().ok()?;
            icons.get(idx).cloned()
        })
        .collect();

    matched_icons
}
