# uuv-assistant-ai

<p align="center">
<a href="https://e2e-test-quest.github.io/uuv/">  
<picture>  
<img alt="UUV Logo" src="https://e2e-test-quest.github.io/uuv/img/uuv.png">  
</picture>  
</a>  
</p>

<h3 align="center">
Assistant AI - Image-based test generation
</h3>

<p align="center">
AI-powered assistant that helps testers and developers generate Cucumber BDD test scenarios from GUI screenshots and HTML content.
</p>

<p align="center">
<a href="https://pypi.org/project/uuv-assistant-ai/" target="_blank">
<img src="https://img.shields.io/pypi/v/uuv-assistant-ai?logo=pypi" alt="PyPI version"/>
</a>
<a href="https://www.python.org/downloads/" target="_blank">
<img src="https://img.shields.io/badge/using-python-3776AB?logo=python&logoColor=white" alt="python"/>
</a>
<a href="https://fastapi.tiangolo.com/" target="_blank">
<img src="https://img.shields.io/badge/using-fastapi-009688?logo=fastapi&logoColor=white" alt="fastapi"/>
</a>
<a href="https://python-poetry.org/" target="_blank">
<img src="https://img.shields.io/badge/using-poetry-60A5FA?logo=python-poetry&logoColor=white" alt="poetry"/>
</a>
<br/>
</p>

<div align="center">
<a href="https://pypi.org/project/uuv-assistant-ai/" target="_blank">
    <img alt="uuv-assistant-ai PyPI download count"
         src="https://img.shields.io/pypi/dm/uuv-assistant-ai?logo=pypi&label=uuv-assistant-ai"></img>
</a>
<br/>
</div>

## What is uuv-assistant-ai?

`uuv-assistant-ai` is an AI-powered service that extends the UUV ecosystem by enabling image-based test generation. It uses Vision Language Models (VLMs) and Large Language Models (LLMs) to:

- **Describe images** - Generate natural language descriptions of UI screenshots
- **Classify images** - Determine if UI elements are decorative or functional
- **Generate test scenarios** - Convert visual UI analysis into Cucumber BDD test steps

This service integrates with the main [`@uuv/assistant`](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-assistant) to provide a complete solution for visual test generation.

## Features

- 🖼️ **Image Description** - Uses VLMs to describe UI screenshots in natural language
- 🧠 **Image Classification** - Classifies images as decorative or functional using LLMs
- 🔄 **Streaming API** - Real-time streaming of analysis results
- 📊 **MLflow Integration** - Experiment tracking for model evaluation
- 🤖 **DSPy Framework** - Built with DSPy for optimized AI workflows
- 🌐 **FastAPI Server** - RESTful API for easy integration

## Installation

### Prerequisites

- Python >=3.9, <4
- [uv](https://github.com/astral-sh/uv) (Python package manager)

### Setup

```bash
cd packages/assistant-ai

# Install dependencies
uv sync

# Create .env file with API configurations
cp .env.example .env
# Edit .env with your API keys
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# LLM Configuration (for text classification)
LLM_API_URL=https://api.openai.com/v1
LLM_API_KEY=your-openai-api-key
LLM_MODEL=gpt-4

# VLM Configuration (for image analysis)
VLM_API_URL=https://api.openai.com/v1
VLM_API_KEY=your-openai-api-key
VLM_MODEL=gpt-4-vision-preview

# MLflow (optional, for experiment tracking)
MLFLOW_TRACKING_URI=http://localhost:5000
```

## Usage

### Start the Server

```bash
# Using uv
uv run uuv-assistant-ai

# Or directly
uvicorn uuv_assistant_ai.server:run --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Endpoints

#### 1. Classify Image (Unified)

Stream image analysis results including description and classification.

```bash
curl -X POST "http://localhost:8000/api/v1/image/classify-unified" \
  -F "html_content=<html>" \
  -F "css_selector=.element-selector" \
  -F "target_img_file=@screenshot.png"
```

**Response** (Server-Sent Events):

```json
{"image_description": "A button labeled 'Submit' with blue background"}
{"is_decorative": false, "confidence": 0.95, "analysis_details": "This is a functional button..."}
```

#### 2. Multiple Image Description

Describe multiple images in a single request.

```bash
curl -X POST "http://localhost:8000/api/v1/image/multiple-describe" \
  -F "target_img_file=@screenshot.png"
```

**Response**:

```json
{
    "descriptions": [
        { "element": "button", "description": "Submit button" },
        { "element": "input", "description": "Text input field" }
    ]
}
```

#### 3. Classify Image (Standard)

Classify an image using a pre-computed description, html_content and css_selector.

```bash
curl -X POST "http://localhost:8000/api/v1/image/classify" \
  -F "html_content=<html>" \
  -F "css_selector=.element-selector" \
  -F "image_description=A button labeled Submit"
```

**Response**:

```json
{
    "is_decorative": false,
    "confidence": 0.95,
    "analysis_details": "This is a functional button..."
}
```

#### When to use which endpoint:

**Quick Start (Recommended)**  
Use `classify-unified` for a simple, one-call approach that returns both image description and classification.

**Advanced / Step-by-step**  
For more control, use the two-step approach:
1. `multiple-describe` - Get descriptions for all UI elements in one screenshot
2. `classify` - Classify each element using the pre-computed description

This step by approach is useful when you need to:
- Reuse descriptions for multiple operations
- Analyze multiple elements separately
- Build custom workflows with intermediate processing

## Development

### Run Tests

```bash
uv run pytest tests/
```

### Lint and Format

```bash
# Lint
uv run ruff check assistant_ai tests/

# Format
uv run ruff format assistant_ai tests/
```

### Build

```bash
uv build
```

## Project Structure

```
packages/assistant-ai/
├── uuv_assistant_ai/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── server.py            # Server startup
│   └── image_classifier/
│       ├── __init__.py
│       ├── agent.py         # Main workflow agent
│       ├── model.py         # Data models
│       └── sub_agents/
│           ├── image_classifier.py   # Image classification agent
│           └── image_describer.py    # Image description agent
├── tests/
│   ├── test_image_classifier.py
│   └── image-dataset.json
├── pyproject.toml           # Python dependencies
└── README.md
```

## Integration with UUV Ecosystem

The `uuv-assistant-ai` service integrates with:

- [`@uuv/assistant`](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-assistant) - Web interface for test generation (integrates with this service)
- [`@uuv/cypress`](https://www.npmjs.com/package/@uuv/cypress) - Cypress execution engine
- [`@uuv/playwright`](https://www.npmjs.com/package/@uuv/playwright) - Playwright execution engine

## Documentation

Full documentation: [https://e2e-test-quest.github.io/uuv/](https://e2e-test-quest.github.io/uuv/)

## License

[<a href="https://github.com/e2e-test-quest/uuv/blob/main/LICENSE">  
<img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"/>  
</a>](https://spdx.org/licenses/MIT.html)

This project is licensed under the terms of the [MIT license](https://github.com/e2e-test-quest/uuv/blob/main/LICENSE).

## Authors

- [`@luifr10`](https://github.com/luifr10) - Louis Fredice NJAKO MOLOM
- [`@stanlee974`](https://github.com/stanlee974) - Stanley SERVICAL

## Support UUV

If you want to help UUV grow, you can fund the project directly via [Open Collective](https://opencollective.com/uuv). Every contribution helps us dedicate more time and energy to improving this open-source tool.

<a href="https://opencollective.com/uuv/contribute" target="_blank">
  <img src="https://opencollective.com/uuv/contribute/button@2x.png?color=blue" width=300 />
</a>
