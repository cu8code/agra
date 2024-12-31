use std::fs::{OpenOptions, create_dir_all};
use std::io::Write;
use std::path::PathBuf;
use chrono::Local;

pub struct Logger {
    log_file_path: PathBuf,
    is_dev: bool,
}

impl Logger {
    // Create a static instance of Logger
    pub fn new() -> Self {
        // Determine if we are in development mode
        let is_dev = std::env::var("DEV").unwrap_or_default() == "true";

        // Create the log directory path
        let home_dir = std::env::home_dir().expect("Failed to get home directory");
        let log_dir = home_dir.join(".config/agra");

        // Create the log directory if it doesn't exist
        create_dir_all(&log_dir).expect("Failed to create log directory");

        // Define the path for the log file
        let log_file_path = log_dir.join("log.txt");

        Logger { log_file_path, is_dev }
    }

    pub fn log(&self, message: &str) {
        let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S");
        let log_message = format!("{} - {}\n", timestamp, message);

        // Log to the console if in development mode
        if self.is_dev {
            print!("{}", log_message);
        }

        // Log to the file
        if let Ok(mut file) = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.log_file_path) 
        {
            if let Err(e) = writeln!(file, "{}", log_message) {
                eprintln!("Failed to write to log file: {}", e);
            }
        } else {
            eprintln!("Failed to open log file for writing.");
        }
    }
}

// Create a static instance of Logger
static mut LOGGER: Option<Logger> = None;

// Public function to initialize the logger
pub fn init() {
    unsafe {
        LOGGER = Some(Logger::new());
    }
}

// Public function for logging messages
pub fn log(message: &str) {
    unsafe {
        if let Some(ref logger) = LOGGER {
            logger.log(message);
        } else {
            eprintln!("Logger not initialized. Call init() first.");
        }
    }
}
