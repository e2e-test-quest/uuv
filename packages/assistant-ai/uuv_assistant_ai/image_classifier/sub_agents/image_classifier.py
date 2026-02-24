from bs4 import BeautifulSoup
from pydantic import BaseModel, Field
import re
import dspy

from ..model import ImageClassifierResult


class BoolWithConfidence(BaseModel):
    value: bool = Field(
        description="Boolean answer based strictly on the analysis of the image and its context in html_page")
    confidence: float = Field(description="Confidence score between 0 (very uncertain) and 1 (absolutely certain)")


class ProcessedImage(BaseModel):
    is_decorative: bool = Field(
        description=(
            """
                Extract image's surrounding text, then determine if the image is decorative using image description and the image's surrounding text.
                
                Analyze the relationship between the image description and the surrounding text
                
                False (informative) if :
                - The surrounding text refers to the image AND and that the image provides additional information : add 0.6 to confidence 
                - The image description alone refers to a message, a tutorial or call to action (text, objects, people, scenes) : add 0.45 to confidence
                
                True (decorative) if :
                - The surrounding text doesn't refer to the image : add 0.3 to confidence
                - The image alone does not seem to convey a message or call to action : add 0.6 to confidence
                
            """
        )
    )
    confidence: float = Field(
        description=(
            """
                Confidence score for the classification decision (0.0 to 1.0).
                High confidence (0.8-1.0): Clear decorative elements (pure patterns) or obvious informative content (text, diagrams, specific objects)
                Medium confidence (0.5-0.79): Some ambiguity but leaning toward classification
                Low confidence (0.0-0.49): Significant uncertainty, classification may need review
            """
        )
    )
    analysis_details: str = Field(
        description=(
            """
                Concise justification (2-4 sentences) explaining the 'is_decorative' value.
            
               Structure:
                1. Visual content description (objects, text, people, patterns observed)
                2. Surrounding piece of text referring to the image
                3. Decision rationale combining both factors
                
                Example: 
                    - "Image contains a call to action figure. The image is referenced in the text as "see following image.". this suggests it is informative and not purely decorative."
                    - "Image contains a call to action figure. Even if the surrounding text does not refer to the image, the message contains in the image seems to be informative enough to be considered as informative and not purely decorative."
                    - "Image shows a decorative pattern with no text or objects conveying a message. The surrounding text does not refer to the image, indicating it is purely decorative."
            """
        )
    )
    # is_important: BoolWithConfidence = Field(
    #     description=(
    #         """
    #         Does this image convey meaningful information or trigger an action,
    #         considering the context given by html_page and css_selector?
    #         True if the image content helps the user understand something or perform an action;
    #         False if it is purely decorative.
    #         """
    #     )
    # )
    # removal_causes_info_loss: BoolWithConfidence = Field(
    #     description=(
    #         """
    #            If this image is removed, will the user lose a significant piece of information or the ability to perform an action, considering html_page and css_selector?
    #            True means its absence would remove essential information or an important function;
    #            False means its absence has no impact on understanding or interacting with the page.
    #         """
    #     )
    # )
    # is_decorative_complete: BoolWithConfidence = Field(
    #     description=(
    #         """
    #             Final synthesis that combines the three previous fields (is_important, removal_causes_info_loss)
    #             and their confidence levels. Use a reasoned judgment rather than a strict rule:
    #             - Give more weight to values with high confidence.
    #             - If the image is likely (high confidence) to be important and its removal would likely cause
    #             loss of information or action, then classify it as NOT decorative (is_decorative.value = False).
    #             - In ambiguous cases with low confidence across all fields, choose the classification that best
    #             fits the balance of probabilities and reflect this uncertainty in is_decorative.confidence.
    #             - The final decision must stay consistent with the three previous fields and justify the level of confidence.
    #         """
    #     )
    # )


class SignatureImageClassifier(dspy.Signature):
    text_before_image: str = dspy.InputField(
        desc=(
            """
                extracted text from the HTML page before the image.
                It provides the structural context to understand the image's purpose.
                This text is used to analyze the relationship between the image and its surrounding content.
            """
        )
    )
    text_after_image: str = dspy.InputField(
        desc=(
            """
                extracted text from the HTML page after the image.
                It provides the structural context to understand the image's purpose.
                This text is used to analyze the relationship between the image and its surrounding content.
            """
        )
    )
    img_description: str = dspy.InputField(
        desc=(
            """
                Description of the image as returned by a vision model: one objective sentence
                mentioning objects, symbols, and visible text.
            """
        )
    )
    # hypothesis: Hypothesis = OutputField(
    #     description=(
    #         """
    #             For each hypothesis (is_important, removal_causes_info_loss, is_decorative),
    #             provide a boolean value and a confidence score.
    #         """
    #     )
    # )
    # result: ProcessedImage = dspy.OutputField(
    #     # description=
    #     # """
    #     #     Final decision: Based on html_page context, css_selector and the image description
    #     #     (image_description without using alt or aria attributes), determine whether the targeted image
    #     #     is useful to understand the page.
    #     #
    #     #     Return a boolean (is_decorative), a confidence score (0 to 1),
    #     #     and a short reasoning text explaining the decision.
    #     # """
    # )
    image_description: str = dspy.OutputField(
        desc=(
            """
                Same as img_description input field
            """
        )
    )
    is_decorative: bool = dspy.OutputField(
        description=(
            """
                Extract image's surrounding text, then determine if the image is decorative using image description and the image's surrounding text.
                
                Analyze the relationship between the image description and the surrounding text
                
                False (informative) if :
                - The surrounding text refers to the image AND and that the image provides additional information : add 0.6 to confidence 
                - The image description alone refers to a message, a tutorial or call to action (text, objects, people, scenes) : add 0.45 to confidence
                
                True (decorative) if :
                - The surrounding text doesn't refer to the image : add 0.3 to confidence
                - The image alone does not seem to convey a message or call to action : add 0.6 to confidence
                
            """
        )
    )
    confidence: float = dspy.OutputField(
        description=(
            """
                Confidence score for the classification decision (0.0 to 1.0).
                High confidence (0.8-1.0): Clear decorative elements (pure patterns) or obvious informative content (text, diagrams, specific objects)
                Medium confidence (0.5-0.79): Some ambiguity but leaning toward classification
                Low confidence (0.0-0.49): Significant uncertainty, classification may need review
            """
        )
    )
    analysis_details: str = dspy.OutputField(
        description=(
            """
                Single concise paragraph (2–3 sentences max) justifying the 'is_decorative' value.
            
                Format rules:
                    - One paragraph only (no bullet points, no list, no structure labels)
                    - Concise, clear, factual
                    - Must include:
                    1) brief visual description
                    2) brief reference (or absence of reference) from surrounding text
                    3) final decision rationale
                
                Example: 
                    - "Image contains a call to action figure. The image is referenced in the text as "see following image.". this suggests it is informative and not purely decorative."
                    - "Image contains a call to action figure. Even if the surrounding text does not refer to the image, the message contains in the image seems to be informative enough to be considered as informative and not purely decorative."
                    - "Image shows a decorative pattern with no text or objects conveying a message. The surrounding text does not refer to the image, indicating it is purely decorative."
            """
        )
    )


class UUVImageClassifierAgent(dspy.Module):
    def __init__(self, llm_api_url: str, llm_api_key: str, llm_model: str):
        super().__init__()
        self.lm = dspy.LM(
            llm_model,
            api_base=llm_api_url,
            api_key=llm_api_key,
            temperature=0.0,
            top_p=0.9,
            max_tokens=2048,
            track_usage=False,
            cache= False,
            cache_in_memory= False
        )
        self.image_classifier = dspy.ChainOfThought(SignatureImageClassifier)

    @staticmethod
    def remove_accessibility_attributes(html_content):
        # Remove aria-* attributes and alt attributes from the HTML content
        cleaned_html = re.sub(r'\s+aria-[a-zA-Z-]+="[^"]*"', '', html_content)
        cleaned_html = re.sub(r'\s+alt="[^"]*"', '', cleaned_html)
        return cleaned_html

    @staticmethod
    def extract_nearest_words_around_image(html_content: str, css_selector: str, word_limit: int = 100):
        soup = BeautifulSoup(html_content, "html.parser")
        img = soup.select_one(css_selector)
        if not img:
            return "", ""
        # Récupérer les mots avant l'image
        words_before = []
        for elem in img.previous_elements:
            if getattr(elem, 'string', None):
                words = elem.string.strip().split()
                words_before = words + words_before
                if len(words_before) >= word_limit:
                    words_before = words_before[-word_limit:]
                    break
        text_before = " ".join(words_before)
        # Récupérer les mots après l'image
        words_after = []
        for elem in img.next_elements:
            if getattr(elem, 'string', None):
                words = elem.string.strip().split()
                words_after += words
                if len(words_after) >= word_limit:
                    words_after = words_after[:word_limit]
                    break
        text_after = " ".join(words_after)
        return text_before, text_after

    def forward(self, image_description: str, html_content: str, css_selector: str) -> ImageClassifierResult:
        cleaned_html = self.remove_accessibility_attributes(html_content=html_content)
        text_before, text_after = self.extract_nearest_words_around_image(
            html_content=cleaned_html,
            css_selector=css_selector,
            word_limit=100
        )
        
        with dspy.context(lm=self.lm):
            return self.image_classifier(
                text_after_image=text_after,
                text_before_image=text_before,
                img_description=image_description
            )
