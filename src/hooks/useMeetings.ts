import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppointmentsData } from './useAppointments';
import { getAuthData } from '../services/authService';
import { zegoCloudService, isMeetingActive, isMeetingStartingSoon } from '../services/zegoCloudService';
import type { Appointment } from '../services/authService';
import dayjs from '../lib/dayjs';

export const useMeetings = () => {
  const [isJoiningMeeting, setIsJoiningMeeting] = useState(false);
  const [currentMeetingRoom, setCurrentMeetingRoom] = useState<string | null>(null);
  const { bookedAppointments, isLoading } = useAppointmentsData();
  const { user } = getAuthData();


  // Initialize ZegoCloud when component mounts
  useEffect(() => {
    const initializeZegoCloud = async () => {
      if (!user) {
        return;
      }

      // Use actual ZegoCloud credentials from environment variables
      const appID = Number(import.meta.env.VITE_APP_ID) || 2138562715;
      const serverSecret = import.meta.env.VITE_APP_SIGN || '6eb3f2db285dd143644ffcab1e5455cd87ee909c62f95f497eae147982f55810';
      
      const config = {
        appID,
        serverSecret,
        userID: user.id.toString(),
        userName: user.name,
        roomID: '',
      };


      const success = await zegoCloudService.initialize(config);
      if (!success) {
          toast.error('Failed to initialize video meeting service');
      }
      // Removed the success toast notification
    };

    initializeZegoCloud();

    // Cleanup on unmount
    return () => {
      zegoCloudService.destroy();
    };
  }, [user]);

  // Get current active meeting
  const getCurrentActiveMeeting = useCallback(() => {
    return bookedAppointments.find(appointment => 
      appointment.room_id && isMeetingActive(appointment.start_time, appointment.end_time)
    );
  }, [bookedAppointments]);

  // Get next meeting that's starting soon - show all appointments for testing
  const getNextMeetingStartingSoon = useCallback(() => {
    // Show the first appointment with room_id, regardless of time
    const nextMeeting = bookedAppointments.find(appointment => 
      appointment.room_id
    );
    
    if (nextMeeting) {
      return nextMeeting;
    }
    return null;
  }, [bookedAppointments]);

  // Get upcoming meetings - show all appointments for testing
  const getUpcomingMeetings = useCallback(() => {
    // Show all appointments with room_id, regardless of date
    return bookedAppointments
      .filter(appointment => appointment.room_id) // Only show appointments with room_id
      .sort((a, b) => dayjs(a.start_time).tz('Africa/Cairo').diff(dayjs(b.start_time).tz('Africa/Cairo')))
      .slice(0, 10); // Get next 10 meetings instead of 5
  }, [bookedAppointments]);

  // Join a meeting
  const joinMeeting = useCallback(async (appointment: Appointment) => {
 
    
    if (!appointment.room_id) {
      toast.error('No meeting room available for this appointment');
      return false;
    }

    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    // Check if ZegoCloud service is initialized
    if (!zegoCloudService.isServiceInitialized()) {
      toast.error('Video service not ready. Please refresh the page.');
      return false;
    }

    setIsJoiningMeeting(true);

    try {
     
      // Join the ZegoCloud room
      const success = await zegoCloudService.joinRoom(appointment.room_id, user.name);
      
      if (success) {
        setCurrentMeetingRoom(appointment.room_id);
        
        // Don't start publishing here - let the MeetingModal handle video/audio
        // The publishing will be started when the modal opens and initializes the video stream
        
        toast.success('Successfully joined meeting room');
        
        // Don't navigate - let the modal handle the meeting interface
        return true;
      } else {
        toast.error('Failed to join meeting room');
        return false;
      }
    } catch (error) {
      
      toast.error('Failed to join meeting room');
      return false;
    } finally {
      setIsJoiningMeeting(false);
    }
  }, [user]);

  // Leave current meeting
  const leaveMeeting = useCallback(async () => {
    try {
      await zegoCloudService.leaveRoom();
      setCurrentMeetingRoom(null);
      toast.success('Left meeting room');
    } catch (error) {
      toast.error('Failed to leave meeting room');
    }
  }, []);

  // Check if user is currently in a meeting
  const isInMeeting = useCallback(() => {
    return zegoCloudService.isInMeeting();
  }, []);

  // Get current room info
  const getCurrentRoomInfo = useCallback(() => {
    return zegoCloudService.getCurrentRoom();
  }, []);

  // Check if meeting can be joined (within 15 minutes of start time)
  const canJoinMeeting = useCallback((appointment: Appointment) => {
    if (!appointment.room_id) return false;
    return isMeetingStartingSoon(appointment.start_time, 15) || 
           isMeetingActive(appointment.start_time, appointment.end_time);
  }, []);

  // Get time until meeting starts
  const getTimeUntilMeeting = useCallback((startTime: string) => {
    const meetingTime = dayjs(startTime).tz('Africa/Cairo');
    const now = dayjs().tz('Africa/Cairo');

    if (meetingTime.isBefore(now)) {
      return 'Meeting time passed';
    }

    const diffInHours = meetingTime.diff(now, 'hour');
    const diffInMinutes = meetingTime.diff(now, 'minute') % 60;

    if (diffInHours > 0) {
      return `in ${diffInHours} hour${diffInHours > 1 ? 's' : ''}${diffInMinutes > 0 ? ` ${diffInMinutes}min` : ''}`;
    } else if (diffInMinutes > 0) {
      return `in ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else {
      return 'Starting now';
    }
  }, []);

  return {
    // State
    isJoiningMeeting,
    setIsJoiningMeeting,
    currentMeetingRoom,
    isLoading,
    
    // Data
    currentActiveMeeting: getCurrentActiveMeeting(),
    nextMeetingStartingSoon: getNextMeetingStartingSoon(),
    upcomingMeetings: getUpcomingMeetings(),
    allBookedAppointments: bookedAppointments,
    
    // Actions
    joinMeeting,
    leaveMeeting,
    
    // Utilities
    isInMeeting: isInMeeting(),
    getCurrentRoomInfo,
    canJoinMeeting,
    getTimeUntilMeeting,
  };
}; 