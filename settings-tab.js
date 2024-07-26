import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from '../lib/supabaseClient';

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    dreamEntryReminder: false,
    weeklyInsights: false,
    communityUpdates: false,
    theme: 'light',
  });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (error) throw error;

      setSettings(data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update({ [key]: value })
        .eq('user_id', supabase.auth.user().id);

      if (error) throw error;

      setSettings({ ...settings, [key]: value });
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', supabase.auth.user().id);

      if (error) throw error;

      // Convert data to CSV or JSON and trigger download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "dream_journal_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.update({ password: newPassword });
      if (error) throw error;
      alert('Password updated successfully');
      setNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to update password');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to login page or update app state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">Notifications:</h3>
        <div className="flex items-center justify-between mb-2">
          <span>Dream Entry Reminder</span>
          <Switch 
            checked={settings.dreamEntryReminder}
            onCheckedChange={(checked) => updateSetting('dreamEntryReminder', checked)}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span>Weekly Insights</span>
          <Switch 
            checked={settings.weeklyInsights}
            onCheckedChange={(checked) => updateSetting('weeklyInsights', checked)}
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span>Community Updates</span>
          <Switch 
            checked={settings.communityUpdates}
            onCheckedChange={(checked) => updateSetting('communityUpdates', checked)}
          />
        </div>
        <h3 className="font-semibold mb-2">Theme:</h3>
        <Select 
          value={settings.theme} 
          onValueChange={(value) => updateSetting('theme', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System Default</SelectItem>
          </SelectContent>
        </Select>
        <h3 className="font-semibold mt-4 mb-2">Data Management:</h3>
        <Button className="w-full mb-2" onClick={handleExportData}>Export Dream Data</Button>
        <Button className="w-full mb-2">Import Dream Data</Button>
        <Button className="w-full mb-2" variant="destructive">Delete All Data</Button>
        <h3 className="font-semibold mt-4 mb-2">Account:</h3>
        <Input 
          type="password" 
          placeholder="New Password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-2"
        />
        <Button className="w-full mb-2" onClick={handleChangePassword}>Change Password</Button>
        <Button className="w-full mb-2">Privacy Settings</Button>
        <Button className="w-full" variant="outline" onClick={handleLogout}>Logout</Button>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
