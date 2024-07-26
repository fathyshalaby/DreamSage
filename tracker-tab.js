import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cloud, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const TrackerTab = () => {
  const [sleepStart, setSleepStart] = useState('');
  const [sleepEnd, setSleepEnd] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [notes, setNotes] = useState('');

  const handleSaveSleepData = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_data')
        .insert([
          {
            sleep_start: sleepStart,
            sleep_end: sleepEnd,
            quality: sleepQuality,
            notes: notes,
          }
        ]);

      if (error) throw error;

      console.log('Sleep data saved successfully:', data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error saving sleep data:', error);
      // Show error message to user
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sleep Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button className="mr-2">
            <Cloud className="mr-2 h-4 w-4" />
            Connect Apple Health
          </Button>
          <Button>
            <Star className="mr-2 h-4 w-4" />
            Connect Fitbit
          </Button>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Manual Sleep Entry:</h3>
          <Input 
            type="datetime-local" 
            className="mb-2" 
            placeholder="Sleep Start Time"
            value={sleepStart}
            onChange={(e) => setSleepStart(e.target.value)}
          />
          <Input 
            type="datetime-local" 
            className="mb-2" 
            placeholder="Wake Up Time"
            value={sleepEnd}
            onChange={(e) => setSleepEnd(e.target.value)}
          />
          <Select value={sleepQuality} onValueChange={setSleepQuality}>
            <SelectTrigger>
              <SelectValue placeholder="Sleep Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          <Textarea 
            className="mt-2" 
            placeholder="Notes (e.g., pre-sleep activities, environment)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button className="mt-2 w-full" onClick={handleSaveSleepData}>Save Sleep Data</Button>
        </div>
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Recent Sleep Stats:</h3>
          {/* You can fetch and display recent sleep stats from Supabase here */}
          <p>Average Sleep Duration: Fetching...</p>
          <p>Average Sleep Quality: Fetching...</p>
          <p>Lucid Dreams This Week: Fetching...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackerTab;
