default: fmt fix

# Startup commands
dev host="127.0.0.1" port="8000":
    uv run uvicorn app.main:app --host {{host}} --port {{port}} --reload

# Code quality commands
fmt:
    uv run ruff format

lint:
    uv run ruff check

fix:
    uv run ruff check --fix

setup-githooks:
    uv run pre-commit install
