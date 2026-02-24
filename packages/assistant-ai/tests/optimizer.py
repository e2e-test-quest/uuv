from dotenv import dotenv_values
from dspy.teleprompt import BootstrapFewShot
import mlflow
from tests.test_image_classifier import create_dspy_examples, is_decorative_metric, load_dataset

from uuv_assistant_ai.image_classifier.agent import UUVImageClassifierWorkflowAgent

config = dotenv_values(".env")

mlflow_tracking_uri = config.get("MLFLOW_TRACKING_URI")
# Configure MLflow autologging for DSPy
mlflow.dspy.autolog(
    log_compiles=True,
    log_evals=True,
    log_traces_from_compile=True
)
mlflow.set_tracking_uri(mlflow_tracking_uri)
mlflow.set_experiment("uuv_assistant")


# Initialize the agent (configure with your API endpoints)
agent = UUVImageClassifierWorkflowAgent(
    llm_api_url=config.get('LLM_API_URL'),
    llm_api_key=config.get('LLM_API_KEY'),
    llm_model=config.get('LLM_MODEL'),
    vlm_api_url=config.get('VLM_API_URL'),
    vlm_api_key=config.get('VLM_API_KEY'),
    vlm_model=config.get('VLM_MODEL')
)

fewshot_optimizer = BootstrapFewShot(
    metric=is_decorative_metric,
    max_bootstrapped_demos=4,
    max_labeled_demos=16,
    max_rounds=1,
    max_errors=10
)

dataset = load_dataset()
devset = create_dspy_examples(dataset)
# Start MLflow run for this evaluation
with mlflow.start_run(run_name="image_classifier_optimization"):
    compiled_agent = fewshot_optimizer.compile(student=agent, trainset=devset)
    save_path = './uuv_assistant_ai_optimized.pkl'
    compiled_agent.save(save_path)
