## Development

### Installation

```bash
# From PyPI
pip install uuv-assistant-ai
# or
uv add uuv-assistant-ai

# From source (for development)
pip install -e .
# or
cd packages/assistant-ai
uv sync
```

### Run Tests

```bash
# Using pip
pip install pytest pytest-cov pytest-html pytest-sugar
pytest tests/

# Using uv
uv run pytest tests/
```

### Lint and Format

```bash
# Lint
uv run ruff check uuv_assistant_ai tests/

# Format
uv run ruff format uuv_assistant_ai tests/
```

### Build

```bash
uv build
```

## Project Structure

```
uuv_assistant_ai/
├── __init__.py
├── main.py              # FastAPI application
├── server.py            # Server startup
└── image_classifier/
    ├── __init__.py
    ├── agent.py         # Main workflow agent
    ├── model.py         # Data models
    └── sub_agents/
        ├── image_classifier.py   # Image classification agent
        └── image_describer.py    # Image description agent
```