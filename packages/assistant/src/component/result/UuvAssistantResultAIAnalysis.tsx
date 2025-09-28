import React, { useState } from "react";
import { Button, Descriptions, Flex, Radio, RadioChangeEvent, Skeleton } from "antd";
import { AIAnalysisModeEnum, PENDING_VALUE, UuvAssistantResultAIAnalysisType } from "../../Commons";

interface UuvAssistantResultAIAnalysisProps {
  aiResult: UuvAssistantResultAIAnalysisType;
}

const renderLoadingField = (fieldValue: any, finalContent: React.ReactNode, numberOfRows: number) => {
    return fieldValue === undefined || fieldValue === null || fieldValue === PENDING_VALUE ? (
        <Skeleton className='uuv-assistant-result-item' title={false} active paragraph={{ rows: numberOfRows }} />
    ) : finalContent;
};

export const UuvAssistantResultAIAnalysis: React.FC<UuvAssistantResultAIAnalysisProps> = ({
    aiResult,
}) => {

    const formatConfidence = (confidence?: number | typeof PENDING_VALUE) => {
        if (!confidence || typeof confidence !== "number") {
            return "N/A";
        }
        return `${(confidence * 100).toFixed(2)}%`;
    };

    // eslint-disable-next-line camelcase
    const formatClassification = (is_decorative?: boolean | typeof PENDING_VALUE) => {
        // eslint-disable-next-line camelcase
        if (is_decorative === undefined || is_decorative === null) {
            return "N/A";
        }
        // eslint-disable-next-line camelcase
        return is_decorative ? "Decorative" : "Informative";
    };

    return (
        <div id="aiResult">
            {aiResult.mode === AIAnalysisModeEnum.UNIFIED || aiResult.image_description !== PENDING_VALUE ?
                <Descriptions id="aiResultDescription" title="AI image analysis">
                    <Descriptions.Item label="Classification">{
                        renderLoadingField(
                            aiResult?.is_decorative,
                            formatClassification(aiResult?.is_decorative),
                            1
                        )
                    }</Descriptions.Item>
                    <Descriptions.Item label="Confidence">{
                        renderLoadingField(
                            aiResult?.confidence,
                            formatConfidence(aiResult?.confidence),
                            1
                        )
                    }</Descriptions.Item>
                    <Descriptions.Item label="Duration">{
                        renderLoadingField(
                            aiResult?.duration,
                            aiResult?.duration + "s",
                            1
                        )
                    }</Descriptions.Item>
                    <Descriptions.Item label="Image description" span={3}>{
                        renderLoadingField(
                            aiResult?.image_description,
                            aiResult?.image_description,
                            2
                        )
                    }</Descriptions.Item>
                    <Descriptions.Item label="Analyse details" span={3}>{
                        renderLoadingField(
                            aiResult?.analysis_details,
                            aiResult?.analysis_details,
                            2
                        )
                    }</Descriptions.Item>
                </Descriptions> :
                <UuvAssistantResultAIImageDescriptionSelector
                    descriptions={aiResult.available_image_descriptions!}
                    onDescriptionSelected={aiResult.onDescriptionSelected}
                />
            }
        </div>
    );
};


interface UuvAssistantResultAIImageDescriptionSelectorProps {
    descriptions: string[] | typeof PENDING_VALUE;
    onDescriptionSelected?: (selectedImageDescription: string) => void;
}

export const UuvAssistantResultAIImageDescriptionSelector: React.FC<UuvAssistantResultAIImageDescriptionSelectorProps> = ({
    descriptions,                                                                                                  onDescriptionSelected
}) => {
    const [selectedDescription, setSelectedDescription] = useState<string | undefined>();

    const onSelectedImageDescriptionChange = ({ target: { value } }: RadioChangeEvent) => {
        setSelectedDescription(value);
    };

    const confirmImageDescriptionSelection = () => {
        if (selectedDescription && onDescriptionSelected) {
            onDescriptionSelected(selectedDescription);
        }
    };

    return (
        <div id={"aiResultImageDescription"} >
            <span>Please, select the most relevant description :</span>
            <Radio.Group
                value={selectedDescription}
                onChange={onSelectedImageDescriptionChange}
                options={[
                    {
                        value: descriptions[0] ?? "desc-0",
                        className: descriptions[0] ?? "desc-0",
                        label: renderLoadingField(
                            descriptions,
                            descriptions[0],
                            2
                        )
                    },
                    {
                        value: descriptions[1] ?? "desc-1",
                        label: renderLoadingField(
                            descriptions,
                            descriptions[1],
                            2
                        )
                    },
                    {
                        value: descriptions[2] ?? "desc-2",
                        label: renderLoadingField(
                            descriptions,
                            descriptions[2],
                            2
                        )
                    }
                ]}
            />
            <Flex justify={"center"}>
                <Button type="primary" onClick={confirmImageDescriptionSelection}>Confirm</Button>
            </Flex>
        </div>
    );
};
