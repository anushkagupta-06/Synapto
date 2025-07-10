import React, { useState } from 'react';
import professors from '../data/professors';

const Professors = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredProfessors = professors.filter((prof) =>
    (prof.name + prof.email + prof.areaOfInterest + (prof.qualification || ''))
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#000] text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">📚 ECE Professors</h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name, email, interest..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Professors Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[75vh] pr-2">
        {filteredProfessors.length > 0 ? (
          filteredProfessors.map((prof, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700"
            >
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">{prof.name}</h2>
              <p className="text-gray-300">
                <span className="font-semibold">Phone:</span> {prof.phone}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span>{' '}
                <a href={`mailto:${prof.email}`} className="text-blue-400 hover:underline">
                  {prof.email}
                </a>
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Qualification:</span> {prof.qualification}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Area of Interest:</span><br />
                {prof.areaOfInterest}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">No professors found.</p>
        )}
      </div>
    </div>
  );
};

export default Professors;