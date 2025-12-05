# Backdrop Editor

A professional web-based tool for creating stunning text backdrops and overlays using AI-powered depth estimation.

[**Live Demo**](https://ashishmahawal.github.io/backdrop_editor/)

## Features

- **Smart Depth**: AI subject detection places text seamlessly behind foreground objects.
- **Advanced Text Control**: Customize font, size, opacity, and blend modes.
- **Gradient Text**: Create beautiful gradient effects with angle control.
- **Multi-line Support**: Add multiple lines of text centered automatically.
- **Privacy First**: All processing happens locally in your browser. No images are uploaded to a server.

## Local Development

Follow these steps to run the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher)
- npm (usually comes with Node.js)

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/ashishmahawal/backdrop_editor.git
    cd backdrop_editor
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # If you encounter peer dependency issues with React 19, run:
    npm install --legacy-peer-deps
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173/backdrop_editor/`).

> **Note**: Since the app is configured for GitHub Pages with a base path, you might need to manually visit `http://localhost:5173/backdrop_editor/` if the redirection doesn't happen automatically.

### building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Deployment

The project is configured to deploy to GitHub Pages.

```bash
npm run deploy
```

This command builds the project and pushes the `dist` folder to the `gh-pages` branch.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **AI/ML**: [Transformers.js](https://huggingface.co/docs/transformers.js/) (Depth Estimation)
- **Styling**: Vanilla CSS (Modern, Responsive)
- **Routing**: React Router DOM
- **SEO**: React Helmet Async
