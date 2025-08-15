import React from "react";
import { Descriptions, Skeleton } from "antd";
import { PENDING_VALUE, UuvAssistantResultAIAnalysisType } from "../../Commons";

interface UuvAssistantResultAIAnalysisProps {
  aiResult: UuvAssistantResultAIAnalysisType;
}

export const UuvAssistantResultAIAnalysis: React.FC<UuvAssistantResultAIAnalysisProps> = ({
    aiResult,
}) => {
    const renderLoadingField = (fieldValue: any, finalContent: React.ReactNode, numberOfRows: number) => {
        return fieldValue === undefined || fieldValue === null || fieldValue === PENDING_VALUE ? (
            <Skeleton className='uuv-assistant-result-item' title={false} active paragraph={{ rows: numberOfRows }} />
        ) : finalContent;
    };

    const formatConfidence = (confidence?: number | typeof PENDING_VALUE) => {
        if(!confidence || typeof confidence !== 'number') {
            return 'N/A';
        }
        return `${(confidence * 100).toFixed(2)}%`;
    };

    const formatClassification = (is_decorative?: boolean | typeof PENDING_VALUE) => {
        if(is_decorative === undefined || is_decorative === null) {
            return 'N/A';
        }
        return is_decorative ? 'Decorative' : 'Informative';
    };

    return (
        <div id="aiResult">
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
                        aiResult?.duration + 's',
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
            </Descriptions>
        </div>
    );
};
