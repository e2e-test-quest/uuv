import React from "react";
import {Descriptions, Skeleton} from "antd";

interface UuvAssistantResultAIAnalysisProps {
  aiResult: any | "pending" | undefined;
}

export const UuvAssistantResultAIAnalysis: React.FC<UuvAssistantResultAIAnalysisProps> = ({
    aiResult,
}) => (
    <div id="aiResult">
        { aiResult === "pending" ?
            <Skeleton active /> :
            <Descriptions id="aiResultDescription" title="AI image analysis">
                <Descriptions.Item label="Is decorative">{String(aiResult?.is_decorative)}</Descriptions.Item>
                <Descriptions.Item label="Confidence">{aiResult?.confidence}</Descriptions.Item>
                <br/>
                <Descriptions.Item  label="Details">{aiResult?.analysis_details}</Descriptions.Item>
            </Descriptions>
        }
    </div>
);
