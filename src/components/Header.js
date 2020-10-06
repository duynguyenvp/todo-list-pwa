import React from 'react';
import {
    Header,
    HeaderName,
    SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';
import './header.scss'

const AppHeader = () => (
    <Header aria-label="Carbon Tutorial">
        <SkipToContent />
        <HeaderName href="/" prefix="IBM">
            TODO List PWA
    </HeaderName>
    </Header>
);

export default AppHeader;