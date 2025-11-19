
import React from 'react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { MaintenancePlaceholder } from '../../components/ui/MaintenancePlaceholder';

const ImageEditor: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'image-editor')!;

    return (
        <ToolContainer
            title={toolInfo.title}
            description={toolInfo.description}
            icon={toolInfo.icon}
            iconColor={toolInfo.color}
        >
            <MaintenancePlaceholder />
        </ToolContainer>
    );
};

export default ImageEditor;
