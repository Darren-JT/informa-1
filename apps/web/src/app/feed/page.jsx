"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, AlertTriangle, FileText, RefreshCw } from 'lucide-react';

export default function FeedPage() {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch crime reports for activity feed
  const { data: reportsData, isLoading, error, refetch } = useQuery({
    queryKey: ['crime-reports-feed'],
    queryFn: async () => {
      const response = await fetch('/api/crime-reports?limit=50');
      if (!response.ok) {
        throw new Error('Failed to fetch crime reports');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCrimeTypeColor = (offenseType) => {
    const highSeverity = ['Murder', 'Homicide', 'Kidnapping', 'Human Trafficking', 'Terrorism'];
    const mediumSeverity = ['Robbery', 'Assault', 'Burglary', 'Drugs - Cocaine', 'Weapons'];
    
    if (highSeverity.some(crime => offenseType.includes(crime))) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (mediumSeverity.some(crime => offenseType.includes(crime))) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white py-8">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-2">Activity Feed</h1>
            <p className="text-gray-300">Real-time updates on criminal activity in your area</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading activity feed...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Error Loading Feed</h1>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-8 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Activity Feed</h1>
              <p className="text-gray-300">Real-time updates on criminal activity in your area</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium shadow-lg disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {reportsData?.reports?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No activity yet</h3>
            <p className="text-gray-600">
              Crime reports and activity will appear here as they're submitted
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reportsData?.reports?.map((report) => (
              <article 
                key={report.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header with criminal info (if applicable) */}
                {report.criminal_name && (
                  <div className="border-b border-gray-100 p-4 bg-gray-50">
                    <div className="flex items-center gap-4">
                      {report.criminal_headshot && (
                        <img 
                          src={report.criminal_headshot}
                          alt={report.criminal_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-black">{report.criminal_name}</h3>
                        <p className="text-sm text-gray-600">{report.criminal_crime}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main content */}
                <div className="p-6">
                  {/* Crime type badge and timestamp */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getCrimeTypeColor(report.offense_type)}`}
                    >
                      {report.offense_type}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1" />
                      {formatTimeAgo(report.created_at)}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Location info */}
                  {(report.city_state || report.incident_address || report.neighborhood) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-500 mt-0.5" />
                        <div className="text-sm">
                          {report.incident_address && (
                            <div className="text-gray-800">{report.incident_address}</div>
                          )}
                          {report.neighborhood && (
                            <div className="text-gray-600">{report.neighborhood}</div>
                          )}
                          {report.city_state && (
                            <div className="text-gray-600">{report.city_state}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional info badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.school_related && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        School Related
                      </span>
                    )}
                    {report.wanted_fugitive && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Wanted/Fugitive
                      </span>
                    )}
                    {report.drugs_involved && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Drugs Involved
                      </span>
                    )}
                    {report.weapons_involved && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Weapons Involved
                      </span>
                    )}
                    {report.abuse_involved && (
                      <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                        Abuse Involved
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => window.location.href = `/map?report=${report.id}`}
                        className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2"
                      >
                        <MapPin size={16} />
                        View on Map
                      </button>
                      {report.news_story_links && (
                        <a 
                          href={report.news_story_links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2"
                        >
                          <FileText size={16} />
                          News Story
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <AlertTriangle size={12} className="mr-1" />
                      Report #{report.id}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load more button (if needed) */}
        {reportsData?.hasMore && (
          <div className="text-center mt-8">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg">
              Load More Reports
            </button>
          </div>
        )}
      </div>
    </div>
  );
}