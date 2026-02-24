import io
from datetime import datetime
import PIL
import mlflow
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values

from . import image_classifier

app = FastAPI(
    title="UUV Assistant AI API",
    description="API serving Assistant AI features",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

config = dotenv_values(".env")

# Configure MLflow tracking (conditional based on .env)
mlflow_tracking_uri = config.get("MLFLOW_TRACKING_URI")
if mlflow_tracking_uri:
    try:
        mlflow.dspy.autolog(
            log_compiles=True,
            log_evals=True,
            log_traces_from_compile=True,
        )
        mlflow.set_tracking_uri(mlflow_tracking_uri)
        mlflow.set_experiment("uuv_assistant")
    except Exception:
        pass

uuv_ai_agent = image_classifier.UUVImageClassifierWorkflowAgent(
    llm_api_url=config["LLM_API_URL"],
    llm_api_key=config["LLM_API_KEY"],
    llm_model=config["LLM_MODEL"],
    vlm_api_url=config["VLM_API_URL"],
    vlm_api_key=config["VLM_API_KEY"],
    vlm_model=config["VLM_MODEL"],
)
# uuv_ai_agent.load(path="uuv_assistant_ai_optimized.pkl", allow_pickle=True)
img_classifier = image_classifier.UUVImageClassifierAgent(
    llm_api_url=config["LLM_API_URL"],
    llm_api_key=config["LLM_API_KEY"],
    llm_model=config["LLM_MODEL"],
)
img_describer = image_classifier.UUVMultipleImageDescriberAgent(
    vlm_api_url=config["VLM_API_URL"],
    vlm_api_key=config["VLM_API_KEY"],
    vlm_model=config["VLM_MODEL"],
)


@app.post("/api/v1/image/classify-unified", response_model_exclude_none=True)
async def unified_classify_an_image(
    html_content: str = Form(None),
    css_selector: str = Form(None),
    target_img_file: UploadFile = File(...),
):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] - incoming request")

    if not html_content or not css_selector:
        raise HTTPException(
            status_code=400, detail="html_content and css_selector are required"
        )

    image_content = await target_img_file.read()
    image_file = PIL.Image.open(io.BytesIO(image_content))
    streamer = uuv_ai_agent.wrap_with_streaming(
        agent=uuv_ai_agent,
        html_content=html_content,
        css_selector=css_selector,
        image_file=image_file,
    )

    return StreamingResponse(streamer(), media_type="text/event-stream")


@app.post("/api/v1/image/multiple-describe")
async def multiple_describe(target_img_file: UploadFile = File(...)):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] - incoming request")

    if not target_img_file:
        raise HTTPException(status_code=400, detail="target_img_file are required")

    image_content = await target_img_file.read()
    image_file = PIL.Image.open(io.BytesIO(image_content))

    return img_describer(image_file).descriptions


@app.post("/api/v1/image/classify")
async def classify_an_image(
    html_content: str = Form(None),
    css_selector: str = Form(None),
    image_description: str = Form(None),
):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] - incoming request")

    if not html_content or not css_selector or not image_description:
        raise HTTPException(
            status_code=400,
            detail="html_content, css_selector and image_description are required",
        )

    return img_classifier(
        html_content=html_content,
        css_selector=css_selector,
        image_description=image_description,
    )
