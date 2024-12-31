use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct FileDetails {
    name: String,
    path: String,
    description: Option<String>,
}

#[tauri::command]
pub fn query_file(query: &str) -> Vec<FileDetails> {
    // Mock data representing files
    let mock_files = vec![
        FileDetails {
            name: "document.txt".to_string(),
            path: "/documents/document.txt".to_string(),
            description: Some("A text document".to_string()),
        },
        FileDetails {
            name: "image.png".to_string(),
            path: "/images/image.png".to_string(),
            description: Some("An image file".to_string()),
        },
        FileDetails {
            name: "presentation.pptx".to_string(),
            path: "/presentations/presentation.pptx".to_string(),
            description: Some("A presentation file".to_string()),
        },
        FileDetails {
            name: "spreadsheet.xlsx".to_string(),
            path: "/spreadsheets/spreadsheet.xlsx".to_string(),
            description: Some("A spreadsheet file".to_string()),
        },
    ];

    // Perform a simple search (case-insensitive)
    mock_files
        .into_iter()
        .filter(|file| file.name.to_lowercase().contains(&query.to_lowercase()))
        .collect()
}
