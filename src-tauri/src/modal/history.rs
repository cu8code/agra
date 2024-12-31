use crate::logger;

use csv::ReaderBuilder;
use csv::WriterBuilder;
use serde::Deserialize;
use serde::Serialize;
use std::env;
use std::fs::{self, File};
use std::path::Path;

const HISTORY_FILE: &str = "history.csv";

pub fn get_history_file_path() -> String {
    // Get the home directory
    let home_dir = env::var("HOME").unwrap_or_else(|_| String::from("."));
    // Construct the full path for the history file
    let history_dir = format!("{}/.config/imposture", home_dir);

    // Create the directory if it doesn't exist
    fs::create_dir_all(&history_dir).expect("Failed to create config directory");

    format!("{}/{}", history_dir, HISTORY_FILE)
}

pub fn append_to_history(entry: &str, entry_type: &str) {
    let history_file_path = get_history_file_path();
    let mut history = Vec::new();
    let mut updated = false;
    let current_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(); // Get current time as string

    // Check if the history file exists; if not, create it with headers
    if !Path::new(&history_file_path).exists() {
        let mut wtr = WriterBuilder::new()
            .has_headers(true)
            .from_writer(File::create(&history_file_path).expect("Failed to create history file"));

        // Write header
        wtr.write_record(&["entry", "count", "last_used", "type"])
            .expect("Failed to write header");
    }

    // Read existing history
    if let Ok(file) = File::open(&history_file_path) {
        let mut rdr = ReaderBuilder::new().has_headers(true).from_reader(file);

        for result in rdr.records() {
            match result {
                Ok(record) => {
                    let existing_entry = record.get(0).unwrap_or("");
                    let count: usize = record.get(1).unwrap_or("0").parse().unwrap_or(0);
                    let last_used: &str = record.get(2).unwrap_or("");
                    let existing_type: &str = record.get(3).unwrap_or("");

                    if existing_entry == entry {
                        // Increment count and update last used time if the entry already exists
                        history.push(vec![
                            existing_entry.to_string(),
                            (count + 1).to_string(),
                            current_time.clone(),
                            existing_type.to_string(),
                        ]);
                        updated = true;
                        logger::log(&format!("Updated entry: {} (count: {})", existing_entry, count + 1));
                    } else {
                        history.push(vec![
                            existing_entry.to_string(),
                            count.to_string(),
                            last_used.to_string(),
                            existing_type.to_string(),
                        ]);
                    }
                }
                Err(e) => eprintln!("Error reading record: {}", e),
            }
        }
    }

    // If the entry was not found, add it with a count of 1, current time, and type
    if !updated {
        history.push(vec![
            entry.to_string(),
            "1".to_string(),
            current_time.clone(),
            entry_type.to_string(),
        ]);
        logger::log(&format!("Added new entry: {}", entry));
    }

    // Write updated history back to file
    let mut wtr = WriterBuilder::new().has_headers(true).from_writer(
        File::create(&history_file_path).expect("Failed to create or open history file"),
    );

    // Write header again (in case of overwrite)
    wtr.write_record(&["entry", "count", "last_used", "type"])
        .expect("Failed to write header");

    for record in history {
        wtr.write_record(record)
            .expect("Failed to write to history file");
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HistoryEntry {
    t: String,
    entry: String,
    count: usize,
    last_used: String,
    entry_type: String, // New field for type
}

#[tauri::command]
pub fn query_history() -> Result<Vec<HistoryEntry>, String> {
    let history_file_path = get_history_file_path();

    let mut history = Vec::new();

    // Try to open the history file
    match File::open(&history_file_path) {
        Ok(file) => {
            let mut rdr = ReaderBuilder::new().has_headers(true).from_reader(file);

            for result in rdr.records() {
                match result {
                    Ok(record) => {
                        if let (Some(entry), Some(count), Some(last_used), Some(entry_type)) =
                            (record.get(0), record.get(1), record.get(2), record.get(3))
                        {
                            let count_value: usize = count.parse().unwrap_or(0);

                            // Create a new HistoryEntry and push it to the vector
                            let history_entry = HistoryEntry {
                                entry: entry.to_string(),
                                count: count_value,
                                last_used: last_used.to_string(),
                                entry_type: entry_type.to_string(), // Read type from CSV
                                t: "history_entry".to_string(),
                            };

                            history.push(history_entry);
                        }
                    }
                    Err(e) => return Err(format!("Error reading record: {}", e)),
                }
            }
            logger::log("Queried history successfully.");
        }
        Err(_) => {
            // If the file does not exist, create it with headers
            let mut wtr = WriterBuilder::new().has_headers(true).from_writer(
                File::create(&history_file_path).expect("Failed to create history file"),
            );

            // Write header
            wtr.write_record(&["entry", "count", "last_used", "type"])
                .expect("Failed to write header");

            logger::log("Created new history file.");
            
            // Return an empty history since the file was just created
            return Ok(history);
        }
    }

    Ok(history)
}
