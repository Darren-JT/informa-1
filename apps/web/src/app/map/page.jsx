"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  Filter,
  Layers,
  Search,
  MapPin,
  User,
  AlertTriangle,
} from "lucide-react";

export default function MapPage() {
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReports, setShowReports] = useState(true);
  const [showCriminals, setShowCriminals] = useState(true);
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("all");
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC
  const [searchParams, setSearchParams] = useState(null);

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const criminalId = urlParams.get("criminal");
    const reportId = urlParams.get("report");

    setSearchParams({ criminalId, reportId });
  }, []);

  // Fetch criminals for map
  const { data: criminalsData } = useQuery({
    queryKey: ["criminals-map"],
    queryFn: async () => {
      const response = await fetch("/api/criminals?limit=100");
      if (!response.ok) {
        throw new Error("Failed to fetch criminals");
      }
      return response.json();
    },
  });

  // Fetch crime reports for map
  const { data: reportsData } = useQuery({
    queryKey: ["crime-reports-map"],
    queryFn: async () => {
      const response = await fetch("/api/crime-reports?limit=100");
      if (!response.ok) {
        throw new Error("Failed to fetch crime reports");
      }
      return response.json();
    },
  });

  // Filter data based on crime type
  const filteredReports = useMemo(() => {
    if (!reportsData?.reports) return [];
    if (crimeTypeFilter === "all") return reportsData.reports;

    return reportsData.reports.filter((report) =>
      report.offense_type.toLowerCase().includes(crimeTypeFilter.toLowerCase()),
    );
  }, [reportsData?.reports, crimeTypeFilter]);

  // Focus on specific criminal or report when URL params are present
  useEffect(() => {
    if (searchParams?.criminalId && criminalsData?.criminals) {
      const criminal = criminalsData.criminals.find(
        (c) => c.id == searchParams.criminalId,
      );
      if (criminal && criminal.location_lat && criminal.location_lng) {
        setMapCenter({
          lat: parseFloat(criminal.location_lat),
          lng: parseFloat(criminal.location_lng),
        });
        setSelectedCriminal(criminal);
      }
    }

    if (searchParams?.reportId && reportsData?.reports) {
      const report = reportsData.reports.find(
        (r) => r.id == searchParams.reportId,
      );
      if (report && report.location_lat && report.location_lng) {
        setMapCenter({
          lat: parseFloat(report.location_lat),
          lng: parseFloat(report.location_lng),
        });
        setSelectedReport(report);
      }
    }
  }, [searchParams, criminalsData, reportsData]);

  // Get unique crime types for filter
  const crimeTypes = useMemo(() => {
    if (!reportsData?.reports) return [];
    const types = new Set(
      reportsData.reports.map((report) => report.offense_type),
    );
    return Array.from(types).sort();
  }, [reportsData?.reports]);

  const getMarkerColor = (type, severity) => {
    const highSeverity = [
      "Murder",
      "Homicide",
      "Kidnapping",
      "Human Trafficking",
      "Terrorism",
    ];
    const mediumSeverity = [
      "Robbery",
      "Assault",
      "Burglary",
      "Drugs - Cocaine",
      "Weapons",
    ];

    if (type === "criminal") return "#000000"; // Black for criminals

    if (highSeverity.some((crime) => severity.includes(crime)))
      return "#ef4444"; // Red
    if (mediumSeverity.some((crime) => severity.includes(crime)))
      return "#f97316"; // Orange
    return "#6b7280"; // Gray
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-black text-white py-4 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Crime Map</h1>
          <p className="text-gray-300 text-sm">
            Criminal activity within 30km radius
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Crime Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select
              value={crimeTypeFilter}
              onChange={(e) => setCrimeTypeFilter(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Crime Types</option>
              {crimeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showCriminals}
                onChange={(e) => setShowCriminals(e.target.checked)}
                className="rounded"
              />
              <User size={16} />
              Criminals
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showReports}
                onChange={(e) => setShowReports(e.target.checked)}
                className="rounded"
              />
              <AlertTriangle size={16} />
              Reports
            </label>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={mapCenter}
            center={mapCenter}
            defaultZoom={12}
            gestureHandling={"greedy"}
            mapTypeControl={false}
            fullscreenControl={false}
            streetViewControl={false}
          >
            {/* Criminal Markers */}
            {showCriminals &&
              criminalsData?.criminals?.map((criminal) => {
                if (!criminal.location_lat || !criminal.location_lng)
                  return null;

                return (
                  <Marker
                    key={`criminal-${criminal.id}`}
                    position={{
                      lat: parseFloat(criminal.location_lat),
                      lng: parseFloat(criminal.location_lng),
                    }}
                    onClick={() => {
                      setSelectedCriminal(criminal);
                      setSelectedReport(null);
                    }}
                  />
                );
              })}

            {/* Crime Report Markers */}
            {showReports &&
              filteredReports?.map((report) => {
                if (!report.location_lat || !report.location_lng) return null;

                return (
                  <Marker
                    key={`report-${report.id}`}
                    position={{
                      lat: parseFloat(report.location_lat),
                      lng: parseFloat(report.location_lng),
                    }}
                    onClick={() => {
                      setSelectedReport(report);
                      setSelectedCriminal(null);
                    }}
                  />
                );
              })}

            {/* Criminal Info Window */}
            {selectedCriminal && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedCriminal.location_lat),
                  lng: parseFloat(selectedCriminal.location_lng),
                }}
                onCloseClick={() => setSelectedCriminal(null)}
              >
                <div className="p-2 max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={selectedCriminal.headshot_url}
                      alt={selectedCriminal.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-black">
                        {selectedCriminal.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedCriminal.primary_crime}
                      </p>
                    </div>
                  </div>
                  {selectedCriminal.description && (
                    <p className="text-sm text-gray-700 mb-3">
                      {selectedCriminal.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => (window.location.href = `/criminals`)}
                      className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/report?criminal=${selectedCriminal.id}`)
                      }
                      className="border border-gray-300 px-3 py-1 rounded text-sm hover:border-black"
                    >
                      Report Activity
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Report Info Window */}
            {selectedReport && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedReport.location_lat),
                  lng: parseFloat(selectedReport.location_lng),
                }}
                onCloseClick={() => setSelectedReport(null)}
              >
                <div className="p-2 max-w-xs">
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-black">
                        {selectedReport.offense_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{selectedReport.id}
                      </span>
                    </div>
                    {selectedReport.criminal_name && (
                      <div className="flex items-center gap-2 mb-2">
                        {selectedReport.criminal_headshot && (
                          <img
                            src={selectedReport.criminal_headshot}
                            alt={selectedReport.criminal_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-medium">
                          {selectedReport.criminal_name}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                    {selectedReport.description}
                  </p>
                  {(selectedReport.incident_address ||
                    selectedReport.neighborhood) && (
                    <div className="text-xs text-gray-600 mb-3">
                      <MapPin size={12} className="inline mr-1" />
                      {selectedReport.incident_address ||
                        selectedReport.neighborhood}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => (window.location.href = `/feed`)}
                      className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
                    >
                      View in Feed
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="font-bold text-black mb-3 flex items-center gap-2">
            <Layers size={16} />
            Legend
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black rounded-full"></div>
              <span>Known Criminals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>High Severity Crimes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>Medium Severity Crimes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span>Other Crimes</span>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="absolute top-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="font-bold text-black mb-3">Area Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Criminals:</span>
              <span className="font-medium">
                {criminalsData?.criminals?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Reports:</span>
              <span className="font-medium">
                {reportsData?.reports?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Filtered Results:</span>
              <span className="font-medium">
                {filteredReports?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
