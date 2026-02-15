from typing import List
import PIL
import dspy


class UniqueImageDescription(dspy.Signature):
    """ 
        You are an expert at describing images precisely and objectively.
        Describe **in one single sentence** what the image shows and include:
        - The main visible objects or symbols
        - Any visible text or numbers, transcribed exactly as shown
        
        STRICT RULES for text:
        - Only mention text or numbers if you clearly see them in the image.
        - If there is no text, do not say there is any.
        - Do not count the same word twice.
        - Do not infer or guess text from context. Only use what is clearly readable.
        - If the text is partially cut or blurred, transcribe exactly what is readable.
        
        Other constraints:
        - Do not include "Image of", "Photo of", or similar prefaces.
        - Do not interpret the purpose or meaning of the image.
        - Be concise, neutral, and factual.
        
        Output format: only the sentence, nothing else.
    """
    image: dspy.Image = dspy.InputField(desc="Image to describe")
    image_description: str = dspy.OutputField(desc="Image description")


class MultipleImageDescription(dspy.Signature):
    """ 
        You are an expert at describing images precisely and objectively.
        Provide **4 different possible sentence descriptions** of what the image shows.
        
        Each description must:
        - The main visible objects or symbols
        - Any visible text or numbers, transcribed exactly as shown
        
        
        STRICT RULES for text:
        - Only mention text or numbers if you clearly see them in the image.
        - If there is no text, do not say there is any.
        - Do not count the same word twice.
        - Do not infer or guess text from context. Only use what is clearly readable.
        - If the text is partially cut or blurred, transcribe exactly what is readable.
        
        Other constraints:
        - Do not include "Image of", "Photo of", or similar prefaces.
        - Do not interpret the purpose or meaning of the image.
        - Be concise, neutral, and factual.
        - Ensure all 4 descriptions are distinct and capture different aspects.
        
        Output format: JSON array with exactly 4 strings: ["description1", "description2", "description3", "description4"]
    """
    image: dspy.Image = dspy.InputField(desc="Image to describe")
    descriptions: List[str] = dspy.OutputField(desc="Exactly 4 distinct image descriptions as a JSON array")


class UUVUniqueImageDescriber(dspy.Module):
    """
    Describe image base on it's content
    """
    def __init__(self, vlm_api_url: str, vlm_api_key: str, vlm_model: str):
        self.lm = dspy.LM(
            vlm_model,
            api_base=vlm_api_url,
            api_key=vlm_api_key,
            temperature=1.0,
            top_p=0.9,
            max_tokens=2048,
            track_usage=False,
            cache=False,
            cache_in_memory=False
        )        
        self.unique_image_describer = dspy.Predict(UniqueImageDescription)

    def forward(self, image_file: PIL.Image) -> str:
        with dspy.context(lm=self.lm):
            return self.unique_image_describer(
                image=dspy.Image.from_PIL(image_file)
            )
        

class UUVMultipleImageDescriber(dspy.Module):
    """
    Describe image base on it's content
    """
    def __init__(self, vlm_api_url: str, vlm_api_key: str, vlm_model: str):
        self.lm = dspy.LM(
            vlm_model,
            api_base=vlm_api_url,
            api_key=vlm_api_key,
            temperature=1.0,
            top_p=0.9,
            max_tokens=2048,
            track_usage=False,
            cache=False,
            cache_in_memory=False
        )        
        self.multiple_image_describer = dspy.Predict(MultipleImageDescription)

    def forward(self, image_file: PIL.Image) -> str:
        with dspy.context(lm=self.lm):
            return self.multiple_image_describer(
                image=dspy.Image.from_PIL(image_file)
            )