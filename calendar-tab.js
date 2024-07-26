import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const CalendarTab = () => {
  const [calendarView, setCalendarView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [dreamEntries, setDreamEntries] = useState([]);

  useEffect(() => {
    generateCalendarDays();
    fetchDreamEntries();
  }, [currentDate, calendarView]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    let days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    const remainingSlots = 42 - days.length;
    for (let i = 0; i < remainingSlots; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }

    setCalendarDays(days);
  };

  const fetchDreamEntries = async () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('date, theme')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);

      if (error) throw error;

      setDreamEntries(data);
    } catch (error) {
      console.error('Error fetching dream entries:', error);
    }
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const getDreamForDay = (day) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return dreamEntries.find(entry => entry.date.startsWith(dateString));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Dream Calendar</span>
          <Select value={calendarView} onValueChange={setCalendarView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="year">Year View</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <Button onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold">{day}</div>
          ))}
          {calendarDays.map((day, index) => {
            const dreamEntry = day.isCurrentMonth ? getDreamForDay(day.day) : null;
            return (
              <div 
                key={index} 
                className={`p-2 text-center ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-100'
                } ${
                  day.day === new Date().getDate() && 
                  currentDate.getMonth() === new Date().getMonth() && 
                  currentDate.getFullYear() === new Date().getFullYear()
                    ? 'bg-blue-100 font-bold'
                    : ''
                } ${dreamEntry ? 'border-2 border-green-500' : ''}`}
              >
                {day.day}
                {dreamEntry && (
                  <div className="text-xs mt-1 text-green-600">{dreamEntry.theme}</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarTab;
