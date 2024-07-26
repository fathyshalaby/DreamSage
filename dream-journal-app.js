import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Moon, Sun, Zap, TrendingUp, Settings, Calendar, Share2 } from 'lucide-react';
import JournalTab from './JournalTab';
import CalendarTab from './CalendarTab';
import InsightsTab from './InsightsTab';
import TrendsTab from './TrendsTab';
import TrackerTab from './TrackerTab';
import SocialTab from './SocialTab';
import SettingsTab from './SettingsTab';

const DreamJournalApp = () => {
  const [activeTab, setActiveTab] = useState('journal');

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Dream Journal</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 gap-2">
          <TabsTrigger value="journal"><Moon className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="calendar"><Calendar className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="insights"><Sun className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="trends"><TrendingUp className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="tracker"><Zap className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="social"><Share2 className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-5 w-5" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal"><JournalTab /></TabsContent>
        <TabsContent value="calendar"><CalendarTab /></TabsContent>
        <TabsContent value="insights"><InsightsTab /></TabsContent>
        <TabsContent value="trends"><TrendsTab /></TabsContent>
        <TabsContent value="tracker"><TrackerTab /></TabsContent>
        <TabsContent value="social"><SocialTab /></TabsContent>
        <TabsContent value="settings"><SettingsTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default DreamJournalApp;
