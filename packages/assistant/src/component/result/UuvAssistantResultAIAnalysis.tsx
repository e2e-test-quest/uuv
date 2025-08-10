import React from "react";
import { Descriptions, Skeleton } from "antd";

interface UuvAssistantResultAIAnalysisProps {
  aiResult: any | "pending" | undefined;
}

export const UuvAssistantResultAIAnalysis: React.FC<UuvAssistantResultAIAnalysisProps> = ({
    aiResult,
}) => {
    const renderContent = (content: React.ReactNode) => {
        return aiResult === "pending" ? (
            <Skeleton className='uuv-assistant-result-item' title={false} active paragraph={{ rows: 1 }} />
        ) : content;
    };

    return (
        <div id="aiResult">
            <Descriptions id="aiResultDescription" title="AI image analysis">
                <Descriptions.Item label="Is decorative">{renderContent(String(aiResult?.is_decorative))}</Descriptions.Item>
                <Descriptions.Item label="Confidence">{renderContent(aiResult?.confidence)}</Descriptions.Item>
                <Descriptions.Item label="Duration">{renderContent(aiResult?.duration + 's')}</Descriptions.Item>
                <Descriptions.Item label="Image description" span={3}>{renderContent(aiResult?.image_description)}</Descriptions.Item>
                <Descriptions.Item label="Analyse details" span={3}>{renderContent(aiResult?.analysis_details)}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};
