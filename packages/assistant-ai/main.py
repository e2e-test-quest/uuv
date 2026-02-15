import io
import json
import asyncio
from datetime import datetime
import PIL
import dspy
from dspy.streaming import streaming_response
import mlflow
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from a11y.image_classifier.image_classifier import ImageClassifierResult, UUVImageClassifier
from a11y.image_classifier.image_classifier_agent import UUVImageClassifierAgent
from dotenv import dotenv_values

from a11y.image_classifier.image_describer import UUVMultipleImageDescriber


app = FastAPI(
    title="UUV Assistant AI API",
    description="API serving Assistant AI features",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mlflow.dspy.autolog(
    log_compiles=True,    # Track optimization process
    log_evals=True,       # Track evaluation results
    log_traces_from_compile=True  # Track program traces during optimization
)

# Configure MLflow tracking
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("uuv_assistant")

config = dotenv_values(".env")
uuv_ai_agent = UUVImageClassifierAgent(
    llm_api_url=config.get('LLM_API_URL'),
    llm_api_key=config.get('LLM_API_KEY'),
    llm_model=config.get('LLM_MODEL'),
    vlm_api_url=config.get('VLM_API_URL'),
    vlm_api_key=config.get('VLM_API_KEY'),
    vlm_model=config.get('VLM_MODEL')
)
img_classifier = UUVImageClassifier(
    llm_api_url=config.get('LLM_API_URL'),
    llm_api_key=config.get('LLM_API_KEY'),
    llm_model=config.get('LLM_MODEL'),
)
img_describer = UUVMultipleImageDescriber(
    vlm_api_url=config.get('VLM_API_URL'),
    vlm_api_key=config.get('VLM_API_KEY'),
    vlm_model=config.get('VLM_MODEL')
)


@app.post("/api/v1/image/classify-unified", response_model_exclude_none=True)
async def unified_classify_an_image(
    html_content: str = Form(None),
    css_selector: str = Form(None),
    target_img_file: UploadFile = File(...)
):
    print(f'[{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}] - incoming request')
    
    if not html_content or not css_selector:
        raise HTTPException(status_code=400, detail="html_content and css_selector are required")
    
    image_content = await target_img_file.read()
    image_file = PIL.Image.open(io.BytesIO(image_content))
    streamer = UUVImageClassifierAgent.wrap_with_streaming(
        agent=uuv_ai_agent,
        html_content=html_content,
        css_selector=css_selector,
        image_file=image_file
    )
    
    return StreamingResponse(
        streamer(),
        media_type='text/event-stream'
    )


@app.post("/api/v1/image/multiple-describe")
async def multiple_describe(
    target_img_file: UploadFile = File(...)
):
    print(f'[{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}] - incoming request')
    
    if not target_img_file:
        raise HTTPException(status_code=400, detail="target_img_file are required")
    
    image_content = await target_img_file.read()
    image_file = PIL.Image.open(io.BytesIO(image_content))

    
    return img_describer(image_file).descriptions


@app.post("/api/v1/image/classify")
async def classify_an_image(
    html_content: str = Form(None),
    css_selector: str = Form(None),
    image_description: str = Form(None)
):
    print(f'[{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}] - incoming request')

    if not html_content or not css_selector or not image_description:
        raise HTTPException(status_code=400, detail="html_content, css_selector and image_description are required")

    return img_classifier(
        html_content=html_content,
        css_selector=css_selector,
        image_description=image_description
    )

