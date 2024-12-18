'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { updateCardTrackedTimes } from '@/app/actions/card';
import { Button } from '@/components/ui/button';
import { Card } from '@/types';

// Utility functions
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const calculateTotalTime = (times: string[]): number => {
  return times.reduce((total, time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return total + hours * 3600 + minutes * 60 + seconds;
  }, 0);
};

const STORAGE_KEYS = {
  isTracking: (id: string) => `timeTracker_${id}_isTracking`,
  startTime: (id: string) => `timeTracker_${id}_startTime`,
} as const;

interface TimeTrackerProps {
  cardData: Card;
}

export default function TimeTracker({ cardData }: TimeTrackerProps) {
  const router = useRouter();
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackedTimes, setTrackedTimes] = useState<string[]>(
    cardData.trackedTimes || [],
  );

  useEffect(() => {
    const storedIsTracking = localStorage.getItem(
      STORAGE_KEYS.isTracking(cardData.id),
    );
    const storedStartTime = localStorage.getItem(
      STORAGE_KEYS.startTime(cardData.id),
    );

    if (storedIsTracking === 'true' && storedStartTime) {
      setIsTracking(true);
      const startTime = parseInt(storedStartTime, 10);
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setCurrentTime(elapsedTime);
    }
  }, [cardData.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking) {
      interval = setInterval(() => {
        const startTime = parseInt(
          localStorage.getItem(STORAGE_KEYS.startTime(cardData.id)) || '0',
          10,
        );
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime(elapsedTime);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, cardData.id]);

  const handleStartStop = () => {
    if (isTracking) {
      const newTrackedTime = formatTime(currentTime);
      setTrackedTimes(prevTimes => [...prevTimes, newTrackedTime]);
      setCurrentTime(0);
      updateCardTrackedTimes({
        card: cardData,
      });
      localStorage.removeItem(STORAGE_KEYS.isTracking(cardData.id));
      localStorage.removeItem(STORAGE_KEYS.startTime(cardData.id));
      router.refresh();
    } else {
      localStorage.setItem(STORAGE_KEYS.isTracking(cardData.id), 'true');
      localStorage.setItem(
        STORAGE_KEYS.startTime(cardData.id),
        Date.now().toString(),
      );
    }
    setIsTracking(!isTracking);
  };

  const totalTime = calculateTotalTime(trackedTimes) + currentTime;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="font-mono text-sm text-gray-600">
          {formatTime(currentTime)}
        </div>
        <Button
          onClick={handleStartStop}
          variant={isTracking ? 'destructive' : 'default'}
          size="xs"
          className="h-6 px-2 py-0 text-xs"
        >
          {isTracking ? 'Stop' : 'Start'}
        </Button>
      </div>
      {trackedTimes.length > 0 && (
        <div className="text-xs font-medium text-gray-500">
          Total: {formatTime(totalTime)}
        </div>
      )}
    </div>
  );
}
