'use client';

import React, { useState, useEffect } from 'react';
import { BusinessHours } from '@/lib/businessHours';

interface RestaurantStatus {
  isTemporarilyClosed: boolean;
  closureReason: string | null;
  lastUpdated: string | null;
}

interface BusinessHoursData {
  businessHours: BusinessHours[];
  restaurantStatus: RestaurantStatus;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BusinessHoursManager() {
  const [data, setData] = useState<BusinessHoursData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tempClosureReason, setTempClosureReason] = useState('');

  useEffect(() => {
    fetchBusinessHours();
  }, []);

  const fetchBusinessHours = async () => {
    try {
      const response = await fetch('/api/business-hours');
      const data = await response.json();
      setData(data);
      setTempClosureReason(data.restaurantStatus?.closureReason || '');
    } catch (error) {
      console.error('Error fetching business hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessHours = async (dayOfWeek: number, hours: Partial<BusinessHours>) => {
    setSaving(true);
    try {
      const response = await fetch('/api/business-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateHours',
          dayOfWeek,
          hours
        }),
      });

      if (response.ok) {
        await fetchBusinessHours();
        setEditingDay(null);
      }
    } catch (error) {
      console.error('Error updating business hours:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleTemporaryClosure = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/business-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'temporaryClosure',
          temporaryClosure: {
            isClosed: !data?.restaurantStatus.isTemporarilyClosed,
            reason: data?.restaurantStatus.isTemporarilyClosed ? null : (tempClosureReason || 'Emergency closure')
          }
        }),
      });

      if (response.ok) {
        await fetchBusinessHours();
      }
    } catch (error) {
      console.error('Error toggling temporary closure:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Business Hours Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage opening hours and temporary closures
        </p>
      </div>

      <div className="p-6">
        {/* Emergency Closure Toggle */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Emergency Closure</h3>
              <p className="text-sm text-gray-600">
                Temporarily close the restaurant for emergencies
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {data?.restaurantStatus.isTemporarilyClosed && (
                <span className="text-red-600 text-sm font-medium">
                  CLOSED: {data.restaurantStatus.closureReason}
                </span>
              )}
              <button
                onClick={toggleTemporaryClosure}
                disabled={saving}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  data?.restaurantStatus.isTemporarilyClosed
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:opacity-50`}
              >
                {saving ? 'Updating...' : 
                  data?.restaurantStatus.isTemporarilyClosed ? 'Reopen' : 'Emergency Close'}
              </button>
            </div>
          </div>
          
          {!data?.restaurantStatus.isTemporarilyClosed && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Closure reason (optional)"
                value={tempClosureReason}
                onChange={(e) => setTempClosureReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          )}
        </div>

        {/* Regular Hours */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 mb-4">Regular Hours</h3>
          {DAYS.map((dayName, dayIndex) => {
            const dayData = data?.businessHours.find(h => h.dayOfWeek === dayIndex);
            const isEditing = editingDay === dayIndex;

            return (
              <BusinessHourRow
                key={dayIndex}
                dayName={dayName}
                dayIndex={dayIndex}
                dayData={dayData}
                isEditing={isEditing}
                onEdit={() => setEditingDay(dayIndex)}
                onSave={(hours) => updateBusinessHours(dayIndex, hours)}
                onCancel={() => setEditingDay(null)}
                saving={saving}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface BusinessHourRowProps {
  dayName: string;
  dayIndex: number;
  dayData?: BusinessHours;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (hours: Partial<BusinessHours>) => void;
  onCancel: () => void;
  saving: boolean;
}

function BusinessHourRow({ 
  dayName, 
  dayData, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  saving 
}: BusinessHourRowProps) {
  const [openTime, setOpenTime] = useState(dayData?.openTime || '09:00');
  const [closeTime, setCloseTime] = useState(dayData?.closeTime || '17:00');
  const [isClosed, setIsClosed] = useState(dayData?.isClosed || false);
  const [isHoliday, setIsHoliday] = useState(dayData?.isHoliday || false);
  const [holidayName, setHolidayName] = useState(dayData?.holidayName || '');

  useEffect(() => {
    if (dayData) {
      setOpenTime(dayData.openTime || '09:00');
      setCloseTime(dayData.closeTime || '17:00');
      setIsClosed(dayData.isClosed);
      setIsHoliday(dayData.isHoliday);
      setHolidayName(dayData.holidayName || '');
    }
  }, [dayData]);

  const handleSave = () => {
    onSave({
      openTime: isClosed || isHoliday ? null : openTime,
      closeTime: isClosed || isHoliday ? null : closeTime,
      isClosed,
      isHoliday,
      holidayName: isHoliday ? holidayName : null
    });
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
        <div className="w-full sm:w-24 font-medium text-gray-800">{dayName}</div>
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Closed</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isHoliday}
                onChange={(e) => setIsHoliday(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Holiday</span>
            </label>
          </div>

          {isHoliday && (
            <input
              type="text"
              placeholder="Holiday name"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            />
          )}

          {!isClosed && !isHoliday && (
            <div className="flex items-center space-x-3">
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const getStatusDisplay = () => {
    if (dayData?.isHoliday) {
      return (
        <span className="text-orange-600 font-medium">
          Holiday: {dayData.holidayName}
        </span>
      );
    }
    if (dayData?.isClosed) {
      return <span className="text-red-600 font-medium">Closed</span>;
    }
    if (dayData?.openTime && dayData?.closeTime) {
      return (
        <span className="text-green-600">
          {dayData.openTime} - {dayData.closeTime}
        </span>
      );
    }
    return <span className="text-gray-500">Not set</span>;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
        <div className="w-24 font-medium text-gray-800">{dayName}</div>
        <div>{getStatusDisplay()}</div>
      </div>
      <button
        onClick={onEdit}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
      >
        Edit
      </button>
    </div>
  );
}