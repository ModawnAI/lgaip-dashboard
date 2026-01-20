'use client';

import { useDashboardStore } from '@/store/dashboard-store';
import {
  Sidebar,
  Header,
  CountrySelector,
  ProductGrid,
  ChannelSelector,
  ContentEditor,
  PipelineVisualization,
  AnalyticsPanel,
  CompliancePanel,
} from '@/components/dashboard';

export default function DashboardPage() {
  const { currentView } = useDashboardStore();

  const renderView = () => {
    switch (currentView) {
      case 'countries':
        return <CountrySelector />;
      case 'products':
        return <ProductGrid />;
      case 'channels':
        return <ChannelSelector />;
      case 'content':
        return <ContentEditor />;
      case 'pipeline':
        return <PipelineVisualization />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'compliance':
        return <CompliancePanel />;
      default:
        return <CountrySelector />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
