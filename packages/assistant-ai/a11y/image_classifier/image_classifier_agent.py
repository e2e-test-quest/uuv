import json
import typing

import PIL
import dspy
from a11y.image_classifier.image_classifier import UUVImageClassifier, ImageClassifierResult
from a11y.image_classifier.image_describer import UUVUniqueImageDescriber


class UUVImageClassifierAgent(dspy.Module):
    def __init__(self, vlm_api_url: str, vlm_api_key: str, vlm_model: str, llm_api_url: str, llm_api_key: str, llm_model: str):
        super().__init__()
        self.image_describer = UUVUniqueImageDescriber(
            vlm_api_url=vlm_api_url,
            vlm_api_key=vlm_api_key,
            vlm_model=vlm_model
        )
        self.image_classifier = UUVImageClassifier(
            llm_api_url=llm_api_url,
            llm_api_key=llm_api_key,
            llm_model=llm_model
        )

    def forward(self, html_content: str, css_selector: str, image_file: PIL.Image) -> ImageClassifierResult:
        """Forward pass that streams two emissions:
        1. Image description (intermediate)
        2. Final classification result
        """
        # Step 1: Describe the image
        image_describer_result = self.image_describer(image_file=image_file)
        
        # Step 2: Classify the image using the description
        image_classifier_result = self.image_classifier(
            html_content=html_content,
            css_selector=css_selector,
            image_description=image_describer_result.image_description
        )
        
        return image_classifier_result

    @staticmethod
    def wrap_with_streaming(agent: "UUVImageClassifierAgent",  html_content: str, css_selector: str, image_file: PIL.Image) -> typing.Generator[ImageClassifierResult, None, None]:
        wrapper = dspy.streamify(
            agent,
            stream_listeners=[
                dspy.streaming.StreamListener(
                    signature_field_name="image_description",
                    predict=agent.image_describer.unique_image_describer
                ),
                dspy.streaming.StreamListener(
                    signature_field_name="analysis_details",
                    predict=agent.image_classifier.image_classifier.predict
                )
            ],
        )

        async def wrapper_result():
            result = ImageClassifierResult()
            async for chunk in wrapper(
                html_content=html_content,
                css_selector=css_selector,
                image_file=image_file,
            ):
                if isinstance(chunk, dspy.streaming.StreamResponse):
                    current = getattr(result, chunk.signature_field_name, None)
                    if current is None:
                        setattr(result, chunk.signature_field_name, chunk.chunk)
                    else:
                        setattr(result, chunk.signature_field_name, current + chunk.chunk)
                    yield f"{json.dumps(result.toDict())}\n"
                elif isinstance(chunk, dspy.Prediction):
                    payload = {
                        "image_description": chunk.image_description,
                        "is_decorative": chunk.is_decorative,
                        "confidence": chunk.confidence,
                        "analysis_details": chunk.analysis_details,
                    }
                    yield f"{json.dumps(payload)}\n"
        
        return wrapper_result
