import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Configuration, OpenAIApi } from "openai";

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const InsightsTab = () => {
  const [insights, setInsights] = useState({
    recentAnalysis: '',
    emotionalTrends: '',
    lucidProgress: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      // Fetch recent dreams for analysis
      const { data: recentDreams, error: recentError } = await supabase
        .from('dreams')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Fetch emotional trends
      const { data: emotionalData, error: emotionalError } = await supabase
        .from('dreams')
        .select('mood')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (emotionalError) throw emotionalError;

      // Fetch lucid dream progress
      const { data: lucidData, error: lucidError } = await supabase
        .from('dreams')
        .select('is_lucid')
        .gte('date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

      if (lucidError) throw lucidError;

      // Generate insights using OpenAI
      const recentAnalysis = await generateInsight("Analyze these recent dreams and provide insights:", recentDreams);
      const emotionalTrends = await generateInsight("Analyze these emotional trends in dreams:", emotionalData);
      const lucidProgress = await generateInsight("Analyze this lucid dreaming progress:", lucidData);

      setInsights({
        recentAnalysis,
        emotionalTrends,
        lucidProgress
      });

    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsight = async (prompt, data) => {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `${prompt}\n\nData: ${JSON.stringify(data)}\n\nInsight:`,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      });

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating insight:', error);
      return "Unable to generate insight at this time.";
    }
  };

  if (isLoading) {
    return <div>Loading insights...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Dream Insights
          <Popover>
            <PopoverTrigger>
              <Info className="h-4 w-4 ml-2 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              Our AI analyzes your dreams based on various factors to provide personalized insights and patterns.
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Recent Dream Analysis:</h3>
          <p>{insights.recentAnalysis}</p>
        </div>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Emotional Trends:</h3>
          <p>{insights.emotionalTrends}</p>
        </div>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Lucid Dreaming Progress:</h3>
          <p>{insights.lucidProgress}</p>
        </div>
        <Button className="w-full" onClick={fetchInsights}>Refresh Insights</Button>
      </CardContent>
    </Card>
  );
};

export default InsightsTab;
