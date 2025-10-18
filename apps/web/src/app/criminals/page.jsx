"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, List, Grid, Filter, ExternalLink } from "lucide-react";

export default function CriminalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'list'
  const [sortBy, setSortBy] = useState("recent"); // 'recent', 'name', 'crime', 'proximity'

  // Fetch criminals
  const {
    data: criminalsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["criminals", searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/criminals?search=${encodeURIComponent(searchQuery)}&limit=100`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch criminals");
      }
      return response.json();
    },
  });

  // Sort criminals based on selected option
  const sortedCriminals = useMemo(() => {
    if (!criminalsData?.criminals) return [];

    let sorted = [...criminalsData.criminals];

    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "crime":
        sorted.sort((a, b) => a.primary_crime.localeCompare(b.primary_crime));
        break;
      case "proximity":
        // For demo purposes, we'll use a mock location calculation
        // In a real app, you'd calculate distance from user's location
        sorted.sort((a, b) => {
          const distanceA = Math.random() * 100; // Mock distance
          const distanceB = Math.random() * 100;
          return distanceA - distanceB;
        });
        break;
      case "recent":
      default:
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return sorted;
  }, [criminalsData?.criminals, sortBy]);

  const handleViewOnMap = (criminal) => {
    // Navigate to map with criminal selected
    window.location.href = `/map?criminal=${criminal.id}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white py-8">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-2">Criminal Database</h1>
            <p className="text-gray-300">
              Search and browse known criminals in your area
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading criminals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Error Loading Criminals
          </h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Criminal Database</h1>
          <p className="text-gray-300">
            Search and browse known criminals in your area
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search criminals by name or crime type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="crime">Crime Type</option>
                  <option value="proximity">Closest to Me</option>
                </select>
              </div>

              {/* Results Count */}
              <span className="text-gray-600">
                {sortedCriminals.length} criminal
                {sortedCriminals.length !== 1 ? "s" : ""} found
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded ${
                  viewMode === "cards"
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {sortedCriminals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              No criminals found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedCriminals.map((criminal) => (
                  <div
                    key={criminal.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Criminal Photo */}
                    <div className="aspect-square">
                      <img
                        src={criminal.headshot_url}
                        alt={criminal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Criminal Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-black mb-1">
                        {criminal.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {criminal.primary_crime}
                      </p>

                      {criminal.description && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {criminal.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewOnMap(criminal)}
                          className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-md flex items-center justify-center gap-2"
                        >
                          <MapPin size={16} />
                          View on Map
                        </button>
                        <a
                          href={`/report?criminal=${criminal.id}`}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors text-sm flex items-center justify-center"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {sortedCriminals.map((criminal) => (
                  <div
                    key={criminal.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {/* Photo */}
                      <img
                        src={criminal.headshot_url}
                        alt={criminal.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-black">
                              {criminal.name}
                            </h3>
                            <p className="text-gray-600">
                              {criminal.primary_crime}
                            </p>
                            {criminal.description && (
                              <p className="text-gray-700 text-sm mt-1 line-clamp-1">
                                {criminal.description}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleViewOnMap(criminal)}
                              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-md flex items-center gap-2"
                            >
                              <MapPin size={16} />
                              View on Map
                            </button>
                            <a
                              href={`/report?criminal=${criminal.id}`}
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors text-sm flex items-center"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
