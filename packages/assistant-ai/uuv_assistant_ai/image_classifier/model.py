class ImageClassifierResult:
    image_description: str
    is_decorative: bool
    confidence: float
    analysis_details: str

    def __init__(self, image_description: str=None, is_decorative=None, confidence=None, analysis_details=None) -> None:
        self.image_description = image_description
        self.is_decorative = is_decorative
        self.confidence = confidence
        self.analysis_details = analysis_details

    def toDict(self):
        return {
            k: v for k, v in {
                "image_description": self.image_description,
                "is_decorative": self.is_decorative,
                "confidence": self.confidence,
                "analysis_details": self.analysis_details
            }.items() if v is not None
        }

