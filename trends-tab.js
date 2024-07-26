import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, BarChart, LineChart, Activity } from 'lucide-react';
import { 
  PieChart as ReChartPie, 
  Pie, 
  Cell, 
  BarChart as ReChartBar, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart as ReChartLine,
  Line,
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '../lib/supabaseClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TrendsTab = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [themeData, setThemeData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [lucidityData, setLucidityData] = useState([]);
  const [intensityData, setIntensityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch theme distribution
      const { data: themeDistribution, error: themeError } = await supabase
        .from('dreams')
        .select('theme, count')
        .gt('created_at', getDateFromTimeRange())
        .group('theme');

      if (themeError) throw themeError;
      setThemeData(themeDistribution.map(item => ({ name: item.theme, value: item.count })));

      // Fetch mood data
      const { data: moodTrend, error: moodError } = await supabase
        .from('dreams')
        .select('created_at, mood')
        .gt('created_at', getDateFromTimeRange())
        .order('created_at');

      if (moodError) throw moodError;
      setMoodData(moodTrend.map(item => ({ 
        name: new Date(item.created_at).toLocaleDateString(), 
        mood: item.mood 
      })));

      // Fetch lucidity data
      const { data: lucidityTrend, error: lucidityError } = await supabase
        .from('dreams')
        .select('is_lucid, count')
        .gt('created_at', getDateFromTimeRange())
        .group('is_lucid');

      if (lucidityError) throw lucidityError;
      setLucidityData([{
        name: 'Dreams',
        lucid: lucidityTrend.find(item => item.is_lucid)?.count || 0,
        nonLucid: lucidityTrend.find(item => !item.is_lucid)?.count || 0
      }]);

      // Fetch intensity data
      const { data: intensityTrend, error: intensityError } = await supabase
        .from('dreams')
        .select('created_at, intensity')
        .gt('created_at', getDateFromTimeRange())
        .order('created_at');

      if (intensityError) throw intensityError;
      setIntensityData(intensityTrend.map(item => ({ 
        name: new Date(item.created_at).toLocaleDateString(), 
        intensity: item.intensity 
      })));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateFromTimeRange = () => {
    const now = new Date();
    switch(timeRange) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  };

  const exportData = async () => {
    // Implementation for exporting data
    console.log('Exporting data...');
    // You could generate a CSV here and trigger a download
  };

  if (isLoading) {
    return <div>Loading trends...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Dream Trends</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Theme Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartPie data={themeData}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    label
                  >
                    {themeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </ReChartPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Mood Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartLine data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mood" stroke="#8884d8" activeDot={{ r: 8 }} />
                </ReChartLine>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Lucidity Frequency
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartBar data={lucidityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lucid" fill="#8884d8" />
                  <Bar dataKey="nonLucid" fill="#82ca9d" />
                </ReChartBar>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Dream Intensity
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartLine data={intensityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="intensity" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </ReChartLine>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full mt-4" onClick={exportData}>Export Trend Data</Button>
      </CardContent>
    </Card>
  );
};

export default TrendsTab;
