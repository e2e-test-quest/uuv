"""
Evaluation script for UUVImageClassifierAgent.unified_analyse_image

Inspired by DSPy evaluation patterns, this script:
- Loads test examples from image-dataset.json
- Evaluates predictions against expected results using dspy.Evaluate
- Tracks results with MLflow for experiment tracking
"""

import json
from typing import List, Tuple

import dspy
import PIL.Image
import requests
import mlflow
from dotenv import dotenv_values

from uuv_assistant_ai.image_classifier.agent import UUVImageClassifierWorkflowAgent


def load_dataset(dataset_path: str = "tests/image-dataset.json") -> List[dict]:
    """Load test examples from JSON dataset."""
    with open(dataset_path, "r", encoding="utf-8") as f:
        return json.load(f)


def create_dspy_examples(dataset: List[dict]) -> List[dspy.Example]:
    """Convert dataset to dspy.Example objects for evaluation."""
    examples = []
    for item in dataset:
        example = dspy.Example(
            name=item["name"],
            html_content=item["html_content"],
            css_selector=item["css_selector"],
            image_file=download_image(item["image_url"]),
            expected_is_decorative=item["expected"]["is_decorative"],
            expected_confidence=item["expected"]["confidence"],
            expected_analysis_details=item["expected"]["analysis_details"],
        ).with_inputs("image_file", "html_content", "css_selector")
        examples.append(example)
    return examples


def download_image(image_url: str) -> PIL.Image.Image:
    """Download image from URL and return PIL Image object."""
    response = requests.get(image_url, stream=True)
    response.raise_for_status()
    return PIL.Image.open(response.raw)


def is_decorative_metric(
    example: dspy.Example, prediction: dspy.Prediction, trace=None
) -> bool:
    """
    Metric function to evaluate if is_decorative prediction matches expected value.

    Args:
        example: The dataset example containing expected_is_decorative
        prediction: The Prediction from the agent
        trace: Optional trace object for debugging

    Returns:
        bool: True if prediction matches expected, False otherwise
    """
    return prediction.is_decorative == example.expected_is_decorative


def evaluate_classifier(
    agent: UUVImageClassifierWorkflowAgent,
    devset: List[dspy.Example],
    num_threads: int = 1,
    display_progress: bool = True,
    display_table: bool = True,
) -> Tuple[float, dspy.Evaluate]:
    """
    Evaluate the UUVImageClassifierAgent on a test dataset using dspy.Evaluate.

    Args:
        agent: The UUVImageClassifierAgent instance to evaluate
        devset: List of dspy.Example objects to evaluate on
        num_threads: Number of threads for parallel evaluation
        display_progress: Whether to show progress bar
        display_table: Whether to display detailed results table

    Returns:
        Tuple of (accuracy, Evaluate object)
    """
    # Configure dspy.Evaluate with the metric and devset
    evaluate = dspy.Evaluate(
        devset=devset,
        num_threads=num_threads,
        display_progress=display_progress,
        display_table=display_table,
    )

    # Run evaluation
    result = evaluate(agent, metric=is_decorative_metric)

    return result


def main():
    """Main entry point for evaluation."""
    
    # Configure MLflow autologging for DSPy
    mlflow.dspy.autolog(
        log_compiles=True,
        log_evals=True,
        log_traces_from_compile=True
    )
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("uuv_assistant")

    config = dotenv_values(".env")

    
    # Initialize the agent (configure with your API endpoints)
    agent = UUVImageClassifierWorkflowAgent(
        llm_api_url=config.get("LLM_API_URL"),
        llm_api_key=config.get("LLM_API_KEY"),
        llm_model=config.get("LLM_MODEL"),
        vlm_api_url=config.get("VLM_API_URL"),
        vlm_api_key=config.get("VLM_API_KEY"),
        vlm_model=config.get("VLM_MODEL"),
    )
    dspy.configure_cache(
        enable_disk_cache=False,
        enable_memory_cache=False,
    )

    # Load dataset and create examples
    print("Loading dataset...")
    dataset = load_dataset()
    devset = create_dspy_examples(dataset)
    print(f"Loaded {len(devset)} test examples")
    
    # Start MLflow run for this evaluation
    with mlflow.start_run(run_name="image_classifier_evaluation"):
        evaluate_classifier(agent, devset)


if __name__ == "__main__":
    main()
