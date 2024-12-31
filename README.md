# Rust-Based Linux Application Launcher

## Overview
This project is a highly customizable application launcher for Linux, built using Rust. Unlike minimalist application launchers, this one focuses on flexibility, creativity, and integration with various services. It is designed to let you craft unique experiences that reflect your personality and preferences.

The launcher is intended to:
- Provide extreme customizability.
- Enable the creation of dynamic views.
- Integrate with random services seamlessly.
- Ship with experimental or broken features for exploration.

No one uses this yet, so feel free to experiment and break things!

## Features
- **Customizable Layouts**: Design your application launcher to look and behave exactly as you want.
- **Service Integration**: Integrate services directly into the launcher.
- **Creative Freedom**: Add or modify features to suit your unique needs.
- **Support for Experimental Features**: Try out new ideas without worrying about breaking things.

## Contributing
This project welcomes contributions from developers, designers, and UX enthusiasts. If you have ideas, suggestions, or questions:
- Open an issue on GitHub. 
- No idea is too small or silly.
- Designers and UX experts are encouraged to fill the canvas with creativity.

## Getting Started
### Prerequisites
- Rust (latest stable version)
- A Linux distribution

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/cu8code/agra.git
   ```
2. Navigate to the project directory:
   ```bash
   cd agra
   ```
3. Build the project:
   ```bash
   pnpm i
   ```
4. Run the application:
   ```bash
   pnpm tauri dev
   ```

## Reporting Issues
If you encounter a bug or have an idea for improvement:
1. Open a GitHub issue.
2. Describe the problem or idea clearly.
3. Share any relevant details or screenshots.

## Acknowledged Frameworks and Libraries
| Framework/Library | Description |
|-------------------|-------------|
| [Tauri](https://github.com/tauri-apps/tauri) | A framework for building tiny, blazingly fast binaries for all major desktop platforms. Developers can integrate any front-end framework that compiles to HTML, JS, and CSS for building their user interface. The backend of the application is a Rust-sourced binary with an API that the front-end can interact with. |
| [simsearch-rs](https://github.com/andylokandy/simsearch-rs) | A simple and lightweight fuzzy search engine that works in memory, searching for similar strings. |

## License
This project is licensed under the [MIT License](LICENSE).
