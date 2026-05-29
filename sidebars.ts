import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  portfolioSidebar: [
    {
      type: 'doc',
      id: 'frontend',
      label: '프론트엔드 (React SPA)',
    },
    {
      type: 'doc',
      id: 'backend',
      label: '백엔드 (Rails API)',
    },
    {
      type: 'doc',
      id: 'mcp',
      label: 'MCP 서버 (Go)',
    },
  ],
};

export default sidebars;
