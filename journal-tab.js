import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from '../lib/supabaseClient';

const JournalTab = () => {
  const [dreamMood, setDreamMood] = useState(50);
  const [isLucid, setIsLucid] = useState(false);
  const [dreamClarity, setDreamClarity] = useState(50);
  const [dreamIntensity, setDreamIntensity] = useState(50);
  const [dreamTags, setDreamTags] = useState([]);
  const [dreamTheme, setDreamTheme] = useState('');
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamDate, setDreamDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSaveDream = async () => {
    const dreamEntry = {
      date: dreamDate,
      mood: dreamMood,
      is_lucid: isLucid,
      clarity: dreamClarity,
      intensity: dreamIntensity,
      tags: dreamTags,
      theme: dreamTheme,
      description: dreamDescription,
    };

    try {
      const { data, error } = await supabase
        .from('dreams')
        .insert([dreamEntry]);

      if (error) throw error;

      console.log('Dream saved successfully:', data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error saving dream:', error);
      // Show error message to user
    }
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setDreamTags([...dreamTags, event.target.value.trim()]);
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Dream Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          type="date" 
          className="mb-2" 
          value={dreamDate}
          onChange={(e) => setDreamDate(e.target.value)}
        />
        <Textarea 
          placeholder="Describe your dream..." 
          className="mb-2" 
          value={dreamDescription}
          onChange={(e) => setDreamDescription(e.target.value)}
        />
        <div className="mb-2">
          <label className="block mb-1">Dream Mood</label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[dreamMood]}
            onValueChange={(value) => setDreamMood(value[0])}
          />
          <div className="flex justify-between text-sm">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Dream Clarity</label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[dreamClarity]}
            onValueChange={(value) => setDreamClarity(value[0])}
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Dream Intensity</label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[dreamIntensity]}
            onValueChange={(value) => setDreamIntensity(value[0])}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span>Lucid Dream</span>
          <Switch
            checked={isLucid}
            onCheckedChange={setIsLucid}
          />
        </div>
        <Select value={dreamTheme} onValueChange={setDreamTheme}>
          <SelectTrigger>
            <SelectValue placeholder="Dream Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="romance">Romance</SelectItem>
            <SelectItem value="nightmare">Nightmare</SelectItem>
            <SelectItem value="flying">Flying</SelectItem>
            <SelectItem value="falling">Falling</SelectItem>
            <SelectItem value="chase">Chase</SelectItem>
            <SelectItem value="test">Test/Exam</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-2">
          <label className="block mb-1">Dream Tags</label>
          <Input 
            placeholder="Enter tags and press Enter" 
            onKeyPress={handleAddTag}
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {dreamTags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
        <Button className="w-full mt-2" onClick={handleSaveDream}>Save Dream</Button>
      </CardContent>
    </Card>
  );
};

export default JournalTab;
