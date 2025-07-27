import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, BookOpen, Users } from 'lucide-react';

const Timetable = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSection, setSelectedSection] = useState('E');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeSlots = [
    { id: 1, time: '09:00-10:00', start: 9, end: 10 },
    { id: 2, time: '10:00-11:00', start: 10, end: 11 },
    { id: 3, time: '11:00-12:00', start: 11, end: 12 },
    { id: 4, time: '12:00-13:00', start: 12, end: 13 },
    { id: 5, time: '14:00-15:00', start: 14, end: 15 },
    { id: 6, time: '15:00-16:00', start: 15, end: 16 },
    { id: 7, time: '16:00-17:00', start: 16, end: 17 },
    { id: 8, time: '17:00-18:00', start: 17, end: 18 }
  ];

  const timetableData = {
    E: {
      Monday: [
        null,
        { subject: 'ECN12101(L)', venue: 'SEW1', code: '[VK]', type: 'Lecture', teacher: 'F' },
        { subject: 'ECN12101(L)', venue: 'SEW1', code: '[VK]', type: 'Lecture', teacher: 'F' },
        { subject: 'MAN12105(L)', venue: 'SEW9', code: 'E1', type: 'Lecture' },
        { subject: 'ECN12102(P)', venue: 'CYN12501(P)', code: 'F2', type: 'Practical', teacher: 'F1' },
        { subject: 'HSN12600(L)', venue: 'GS3', code: 'JE', type: 'Lecture' },
        { subject: 'ECN12401*(L)', venue: 'GS7', code: '[VB]', type: 'Lecture' },
        null
      ],
      Tuesday: [
        null,
        { subject: 'HSN12600(L)', venue: 'GS8', code: 'E', type: 'Lecture' },
        { subject: 'MAN12105(L)', venue: 'SEW9', code: 'JF1', type: 'Lecture' },
        { subject: 'HSN12600(P)', venue: 'ECN12101(P)', code: 'F1', type: 'Practical', teacher: 'F2' },
        { subject: 'MAN12105(L)', venue: 'FC5', code: 'JF', type: 'Lecture' },
        { subject: 'ECN12401*(P)', type: 'Practical' },
        { subject: 'CYN12501(L)', venue: 'NLH2', type: 'Lecture' },
        null
      ],
      Wednesday: [
        null,
        { subject: 'ECN12101(L)', venue: 'FE18', code: 'E', type: 'Lecture', teacher: '[VK]' },
        { subject: 'ECN12101(L)', venue: 'FE18', code: 'JE', type: 'Lecture', teacher: '[VK]' },
        { subject: 'ECN12102(P)', venue: 'ECN12101(P)', code: 'E2', type: 'Practical', teacher: 'F1' },
        { subject: 'MAN12105(L)', venue: 'FEW1', code: 'JE', type: 'Lecture' },
        { subject: 'HSN12600(P)', venue: 'FC5', code: 'JE1', type: 'Practical' },
        { subject: 'ECN12401*(L)', venue: 'GS7', code: '[VB]', type: 'Lecture' },
        null
      ],
      Thursday: [
        null,
        { subject: 'CYN12501(L)', venue: 'NLH2', type: 'Lecture' },
        { subject: 'MAN12105(L)', venue: 'FEW1', code: 'JE', type: 'Lecture' },
        { subject: 'HSN12600(P)', venue: 'ECN12101(P)', code: 'F2', type: 'Practical', teacher: 'E1' },
        { subject: 'ECN12102(L)', venue: 'FC5', code: 'JE', type: 'Lecture', teacher: '[DP]' },
        { subject: 'HSN12600(P)', venue: 'CYN12501(P)', code: 'E2', type: 'Practical', teacher: 'E1' },
        { subject: 'IDN12600(L)', venue: 'NLH1', code: 'JE+', type: 'Lecture' },
        null
      ],
      Friday: [
        null,
        { subject: 'CYN12501(P)', code: 'F2', type: 'Practical' },
        { subject: 'ECN12101(P)', venue: 'ECN12102(P)', code: 'E2', type: 'Practical', teacher: 'E1' },
        { subject: 'CYN12501(T)', venue: 'MAN12105(T)', code: 'E1 SEW1', type: 'Tutorial', teacher: 'E2 SEW10' },
        { subject: 'MAN12105(L)', venue: 'FC5', code: 'JE', type: 'Lecture' },
        { subject: 'ECN12102(L)', venue: 'FC5', code: 'JF', type: 'Lecture', teacher: '[SC]' },
        null,
        null
      ],
      Saturday: [
        null,
        { subject: 'Extra Activity', type: 'Activity' },
        null,
        null,
        null,
        null,
        null,
        null
      ]
    },
    F: {
      Monday: [
        null,
        { subject: 'ECN12101(L)', venue: 'SEW1', code: '[VK]', type: 'Lecture', teacher: 'F' },
        { subject: 'ECN12101(L)', venue: 'SEW1', code: '[VK]', type: 'Lecture', teacher: 'F' },
        { subject: 'MAN12105(L)', venue: 'GS3', code: 'JF', type: 'Lecture' },
        { subject: 'CYN12501(P)', code: 'JE2', type: 'Practical' },
        { subject: 'HSN12600(L)', venue: 'GS3', code: 'JE', type: 'Lecture' },
        { subject: 'ECN12401*(L)', venue: 'GS7', code: '[VB]', type: 'Lecture' },
        null
      ],
      Tuesday: [
        null,
        { subject: 'HSN12600(L)', venue: 'GS8', code: 'E', type: 'Lecture' },
        { subject: 'CYN12501(T)', venue: 'FE18', code: 'JE2', type: 'Tutorial' },
        { subject: 'HSN12600(P)', venue: 'ECN12101(P)', code: 'F1', type: 'Practical', teacher: 'F2' },
        { subject: 'MAN12105(L)', venue: 'FC5', code: 'JF', type: 'Lecture' },
        { subject: 'ECN12401*(P)', type: 'Practical' },
        { subject: 'CYN12501(L)', venue: 'NLH2', type: 'Lecture' },
        null
      ],
      Wednesday: [
        null,
        { subject: 'ECN12101(L)', venue: 'FE18', code: 'E', type: 'Lecture', teacher: '[VK]' },
        { subject: 'MAN12105(L)', venue: 'FEW1', code: 'JF', type: 'Lecture' },
        { subject: 'CYN12501(T)', venue: 'FEW1', code: 'F', type: 'Tutorial', teacher: '2' },
        { subject: 'HSN12600(L)', venue: 'FC5', code: 'JF', type: 'Lecture' },
        { subject: 'HSN12600(P)', venue: 'FC5', code: 'JE1', type: 'Practical' },
        { subject: 'ECN12401*(L)', venue: 'GS7', code: '[VB]', type: 'Lecture' },
        null
      ],
      Thursday: [
        null,
        { subject: 'CYN12501(L)', venue: 'NLH2', type: 'Lecture' },
        { subject: 'MAN12105(L)', venue: 'SEW10', code: 'JF2', type: 'Lecture' },
        { subject: 'HSN12600(P)', venue: 'ECN12101(P)', code: 'F2', type: 'Practical', teacher: 'E1' },
        { subject: 'ECN12102(L)', venue: 'FC5', code: 'JE', type: 'Lecture', teacher: '[DP]' },
        { subject: 'HSN12600(L)', venue: 'FC5', code: 'JF', type: 'Lecture' },
        { subject: 'IDN12600(L)', venue: 'NLH1', code: 'JE+', type: 'Lecture' },
        null
      ],
      Friday: [
        null,
        { subject: 'CYN12501(P)', code: 'F2', type: 'Practical' },
        { subject: 'ECN12101(P)', venue: 'ECN12102(P)', code: 'E2', type: 'Practical', teacher: 'E1' },
        { subject: 'IDN12600(L)', venue: 'NLH1', code: 'JE+', type: 'Lecture', teacher: 'F' },
        { subject: 'MAN12105(L)', venue: 'FC5', code: 'JE', type: 'Lecture' },
        { subject: 'ECN12102(L)', venue: 'FC5', code: 'JF', type: 'Lecture', teacher: '[SC]' },
        null,
        null
      ],
      Saturday: [
        null,
        { subject: 'Extra Activity', type: 'Activity' },
        null,
        null,
        null,
        null,
        null,
        null
      ]
    }
  };

  const subjectNames = {
    'CYN12501': 'Engineering Chemistry I',
    'MAN12105': 'Mathematics-II',
    'ECN12102': 'CAD for Electronics',
    'HSN12600': 'Professional Communication',
    'ECN12101': 'Electronic Devices',
    'IDN12600': 'Introduction to Environment and Climate',
    'ECN12401': 'Advanced Electronics'
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[currentTime.getDay() - 1] || 'Monday';
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  const getCurrentClass = () => {
    const todaySchedule = timetableData[selectedSection][currentDay];
    if (!todaySchedule) return null;

    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      const classData = todaySchedule[i];
      
      if (classData && currentHour >= slot.start && currentHour < slot.end) {
        return { ...classData, time: slot.time, isOngoing: true };
      }
    }
    return null;
  };

  const getUpcomingClass = () => {
    const todaySchedule = timetableData[selectedSection][currentDay];
    if (!todaySchedule) return null;

    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      const classData = todaySchedule[i];
      
      if (classData && (currentHour < slot.start || (currentHour === slot.start && currentMinutes < 0))) {
        return { ...classData, time: slot.time, isUpcoming: true };
      }
    }
    return null;
  };

  const getClassTypeColor = (type) => {
    switch (type) {
      case 'Lecture': return 'bg-blue-900 border-blue-600 text-blue-200';
      case 'Practical': return 'bg-green-900 border-green-600 text-green-200';
      case 'Tutorial': return 'bg-purple-900 border-purple-600 text-purple-200';
      case 'Activity': return 'bg-orange-900 border-orange-600 text-orange-200';
      default: return 'bg-gray-800 border-gray-600 text-gray-200';
    }
  };

  const currentClass = getCurrentClass();
  const upcomingClass = getUpcomingClass();

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Motilal Nehru National Institute of Technology Allahabad
          </h1>
          <h2 className="text-xl text-gray-300 text-center mb-4">
            Electronics and Communication Engineering - Second Semester
          </h2>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-semibold text-gray-200">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-lg font-semibold text-gray-200">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Section Selector */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 mb-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSelectedSection('E')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedSection === 'E'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Section E
            </button>
            <button
              onClick={() => setSelectedSection('F')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedSection === 'F'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Section F
            </button>
          </div>
        </div>

        {/* Current and Upcoming Classes */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Current Class */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-green-400" />
              Current Class
            </h3>
            {currentClass ? (
              <div className={`p-4 rounded-lg border-2 ${getClassTypeColor(currentClass.type)}`}>
                <div className="font-semibold text-lg mb-2">
                  {subjectNames[currentClass.subject?.split('(')[0]] || currentClass.subject}
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {currentClass.time}
                  </div>
                  {currentClass.code && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {currentClass.code}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {currentClass.type}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No class is currently running
              </div>
            )}
          </div>

          {/* Upcoming Class */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-orange-400" />
              Next Class
            </h3>
            {upcomingClass ? (
              <div className={`p-4 rounded-lg border-2 ${getClassTypeColor(upcomingClass.type)}`}>
                <div className="font-semibold text-lg mb-2">
                  {subjectNames[upcomingClass.subject?.split('(')[0]] || upcomingClass.subject}
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {upcomingClass.time}
                  </div>
                  {upcomingClass.code && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {upcomingClass.code}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {upcomingClass.type}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No more classes today
              </div>
            )}
          </div>
        </div>

        {/* Weekly Timetable */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Weekly Timetable - Section {selectedSection}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-left font-semibold text-gray-200">Day</th>
                  {timeSlots.map(slot => (
                    <th key={slot.id} className="border border-gray-600 p-3 text-center font-semibold min-w-32 text-gray-200">
                      {slot.time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day} className={day === currentDay ? 'bg-gray-700' : 'bg-gray-800'}>
                    <td className="border border-gray-600 p-3 font-semibold text-gray-200">
                      {day}
                      {day === currentDay && (
                        <span className="ml-2 text-blue-400 text-sm">(Today)</span>
                      )}
                    </td>
                    {timeSlots.map((slot, index) => {
                      const classData = timetableData[selectedSection][day][index];
                      return (
                        <td key={slot.id} className="border border-gray-600 p-2">
                          {classData ? (
                            <div className={`p-2 rounded text-xs ${getClassTypeColor(classData.type)}`}>
                              <div className="font-semibold mb-1">
                                {subjectNames[classData.subject?.split('(')[0]] || classData.subject}
                              </div>
                              {classData.code && (
                                <div className="text-xs">{classData.code}</div>
                              )}
                              <div className="text-xs">{classData.type}</div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-900 border border-blue-600 rounded mr-2"></div>
              <span className="text-sm text-gray-300">Lecture</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-900 border border-green-600 rounded mr-2"></div>
              <span className="text-sm text-gray-300">Practical</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-900 border border-purple-600 rounded mr-2"></div>
              <span className="text-sm text-gray-300">Tutorial</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-900 border border-orange-600 rounded mr-2"></div>
              <span className="text-sm text-gray-300">Activity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;