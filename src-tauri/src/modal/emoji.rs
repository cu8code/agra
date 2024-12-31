use crate::logger;

use emojis::iter;
use serde::{Deserialize, Serialize};
use simsearch::SimSearch;
use std::vec::Vec;

// Define a custom struct for Emoji
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Emoji {
    t: String,
    id: String,
    name: String,
    glyph: String,
}

pub fn load_emojis() -> Vec<Emoji> {
    let mut emoji_vec = Vec::new();
    logger::log("Loading emojis..."); // Log the loading process

    for emoji in iter() {
        let id = emoji.name().to_string(); // Use emoji name as ID
        let glyph = emoji.to_string();
        let name = emoji.name().to_string();

        // Create an Emoji instance and push it to the vector
        let emoji_instance = Emoji {
            id,
            name,
            glyph,
            t: "emoji".to_string(),
        };
        emoji_vec.push(emoji_instance);
    }

    logger::log(&format!("Loaded {} emojis.", emoji_vec.len())); // Log the number of loaded emojis
    emoji_vec
}

#[tauri::command]
pub fn query_emojis(query: &str) -> Vec<Emoji> {
    logger::log(&format!("Querying emojis for: {}", query)); // Log the query

    let emojis = load_emojis(); // Load all emojis
    let mut matched_emojis = Vec::new();

    // Create a SimSearch engine
    let mut engine: SimSearch<String> = SimSearch::new();

    // Insert emoji names into the search engine
    for emoji in &emojis {
        engine.insert(emoji.name.clone(), &emoji.id.clone());
    }

    // Perform the search using simsearch
    let results: Vec<String> = engine.search(query);

    // Collect matched emojis based on the search results
    for selected_name in results {
        if let Some(emoji) = emojis.iter().find(|e| e.name == selected_name) {
            matched_emojis.push(emoji.clone());
        }
    }

    logger::log(&format!("Found {} matching emojis.", matched_emojis.len())); // Log the number of matches

    matched_emojis
}
