import asyncio
from datetime import datetime

import dspy
import mlflow
import PIL
from PIL import Image
import requests

from a11y.image_classifier.image_classifier import ImageClassifierResult, UUVImageClassifier
from a11y.image_classifier.image_describer import UUVImageDescriber
from dotenv import dotenv_values

LLM_API_URL="http://localhost:11434"
LLM_API_KEY=""
LLM_MODEL="ollama_chat/llama3.1:8b"

class MyStatusMessageProvider(dspy.streaming.StatusMessageProvider):
    def lm_start_status_message(self, instance, inputs):
        return f"Calling LM with inputs {inputs}..."

    def lm_end_status_message(self, outputs):
        return f"Tool finished with output: {outputs}!"
    
mlflow.dspy.autolog(
    log_compiles=True,    # Track optimization process
    log_evals=True,       # Track evaluation results
    log_traces_from_compile=True  # Track program traces during optimization
)

# Configure MLflow tracking
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("DSPy-Optimization")

dspy.configure_cache(
    enable_disk_cache=False,
    enable_memory_cache=False,
)
dspy.configure(
    lm=dspy.LM(
        LLM_MODEL,
        api_base=LLM_API_URL
    )
)

# Module custom
class MonModule(dspy.Module):
    def __init__(self, vlm_api_url: str, vlm_api_key: str, vlm_model: str, llm_api_url: str, llm_api_key: str, llm_model: str):
        super().__init__()
        self.image_describer = UUVImageDescriber(
            vlm_api_url=vlm_api_url,
            vlm_api_key=vlm_api_key,
            vlm_model=vlm_model
        )
        self.image_classifier = UUVImageClassifier(
            llm_api_url=llm_api_url,
            llm_api_key=llm_api_key,
            llm_model=llm_model
        )
        self.predict1 = dspy.Predict("question -> answer")
        self.predict2 = dspy.Predict("answer -> simplified_answer")

    def forward(self, question: str, image_file: PIL.Image) -> ImageClassifierResult :
        """Forward pass that streams two emissions:
        1. Image description (intermediate)
        2. Final classification result
        """
        # Step 1: Describe the image
        # image_description = self.image_describer.describe(image_file=image_file).description
        
        # # Emit intermediate status with image description
        # print(f'[{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}] - image_description: {image_description}')
        
        # Step 2: Classify the image using the description
        image_description = self.image_describer(
            image_file=image_file
        )

        result = self.image_classifier(
            html_content="html_content",
            css_selector="css_selector",
            image_description=image_description
        )
        
        print(f'[{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}] - response: {result}')
        
        return result

config = dotenv_values(".env")
module = MonModule(
    llm_api_url=config.get('LLM_API_URL'),
    llm_api_key=config.get('LLM_API_KEY'),
    llm_model=config.get('LLM_MODEL'),
    vlm_api_url=config.get('VLM_API_URL'),
    vlm_api_key=config.get('VLM_API_KEY'),
    vlm_model=config.get('VLM_MODEL')
)

# Déclarer les champs à écouter en streaming
stream_listeners = [
    dspy.streaming.StreamListener(signature_field_name="image_description"),
    dspy.streaming.StreamListener(signature_field_name="analysis_details"),
]

# Wrapper le module
stream_module = dspy.streamify(module, stream_listeners=stream_listeners)

# Consommer le stream — OBLIGATOIREMENT async
async def main():
    im = Image.open(requests.get("http://farm1.staticflickr.com/149/437547179_84c28a4c37_z.jpg", stream=True).raw)
    output = stream_module(question="Pourquoi le poulet a traversé la route ?", image_file=im)
    return_value = None

    async for chunk in output:
        if isinstance(chunk, dspy.streaming.StreamResponse):
            # Token en cours de génération
            print(chunk, end="", flush=True)
        elif isinstance(chunk, dspy.Prediction):
            # Résultat final
            return_value = chunk

    return return_value

result = asyncio.run(main())
print(result)