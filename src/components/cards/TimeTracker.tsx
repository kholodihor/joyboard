"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/types"
import { updateCardTrackedTimes } from "@/app/actions/card"
import { useRouter } from "next/navigation"

interface TimeTrackerProps {
  cardData: Card
}

export default function TimeTracker({ cardData }: TimeTrackerProps) {
  const router = useRouter()
  const [isTracking, setIsTracking] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [trackedTimes, setTrackedTimes] = useState<string[]>(cardData.trackedTimes || [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTracking])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleStartStop = () => {
    if (isTracking) {
      const newTrackedTime = formatTime(currentTime)
      setTrackedTimes((prevTimes) => [...prevTimes, newTrackedTime])
      setCurrentTime(0)
      updateCardTrackedTimes({ 
        card: { ...cardData, trackedTimes: [...trackedTimes, newTrackedTime] } 
      })
      router.refresh()
    }
    setIsTracking(!isTracking)
  }

  const calculateTotalTime = (times: string[]): number => {
    return times.reduce((total, time) => {
      const [hours, minutes, seconds] = time.split(':').map(Number)
      return total + hours * 3600 + minutes * 60 + seconds
    }, 0)
  }

  const totalTime = calculateTotalTime(trackedTimes)

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Time Tracker</h3>
      <div className="flex items-center space-x-2 mb-2">
        <div className="text-lg font-mono">{formatTime(currentTime)}</div>
        <Button onClick={handleStartStop} variant={isTracking ? "destructive" : "default"} size={'xs'}>
          {isTracking ? "Stop" : "Start"}
        </Button>
      </div>
      {trackedTimes.length > 0 && (
        <div>
          {/* <h4 className="text-xs font-semibold mb-1">Tracked Times:</h4> */}
          {/* <ul className="text-xs space-y-1">
            {trackedTimes.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul> */}
          <div className="mt-4 text-sm font-semibold">
            Total Time: {formatTime(totalTime)}
          </div>
        </div>
      )}
    </div>
  )
}