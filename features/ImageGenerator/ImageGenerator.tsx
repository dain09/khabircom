
import React from 'react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { MaintenancePlaceholder } from '../../components/ui/MaintenancePlaceholder';
import { useLanguage } from '../../hooks/useLanguage';

const ImageGenerator: React.FC = () => {
    const { t } = useLanguage();
    const toolInfo = TOOLS.find(t => t.id === 'image-generator')!;

    return (
        <ToolContainer
            title={t(toolInfo.title)}
            description={t(toolInfo.description)}
            icon={toolInfo.icon}
            iconColor={toolInfo.color}
        >
            <MaintenancePlaceholder />
        </ToolContainer>
    );
};

export default ImageGenerator;
