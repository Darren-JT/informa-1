"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Upload, FileText, Check, AlertCircle } from 'lucide-react';

const OFFENSE_TYPES = [
  'Abduction', 'Abscond Bail', 'Additional Information', 'Aggravated Assault',
  'Aiding and Abetting', 'Arson', 'Bank Fraud', 'Breach of Condition of Bail',
  'Breach of Excise Duty Act', 'Breach of the Disaster Risk Management Act',
  'Burglary', 'Burglary Habitation', 'Carnal Abuse', 'Child Abuse',
  'Child in Need of Care & Protection', 'Child Pornography', 'Contraband',
  'Corruption', 'Crime of the Month', 'Dead Body', 'Drugs - Cocaine',
  'Drugs - Marijuana', 'Escapee', 'Forgery', 'Fraud', 'Fraudulent Use of License Plate',
  'Fugitive', 'Gunmen', 'Harboring Fugitive', 'Homicide', 'House Breaking',
  'Human Trafficking', 'Illegal Activities', 'Illegal Firearm/Ammo', 'Illegal Gambling',
  'Illegal Immigrant', 'Illegal Sale of Petrol', 'Illicit Goods', 'Incest',
  'Kidnapping', 'Larceny', 'Lottery Scamming', 'Missing Person', 'MOCA Tip Line',
  'Murder', 'Person of Interest', 'Planned Murder', 'Praedial Larceny', 'Query',
  'Rape', 'Robbery', 'Robbery with Aggravation', 'Sacrilege', 'Sexual Assault',
  'Shooting with Intent', 'Stolen Motor Vehicle', 'Stolen Property', 'Suspicious Activities',
  'Suspicious Person', 'Terrorism', 'Theft', 'Threat', 'Uncustomed Goods',
  'Unlawful Discharge of Firearm', 'Wanted Person', 'Warrant', 'Other'
];

const HOW_HEARD_OPTIONS = [
  'Facebook', 'Twitter', 'Internet', 'TV', 'Radio', 'Newspaper', 'Flyer',
  'Word of Mouth', 'Public Service Announcement', 'Sign/Billboard', 'Instagram',
  'Flyer/Poster', 'Public Bus', 'Movie Theater', 'Law enforcement', 'Kiosk', 'Other'
];

export default function ReportPage() {
  const [reportType, setReportType] = useState('existing_criminal');
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [criminalSearch, setCriminalSearch] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: {
      school_related: false,
      wanted_fugitive: false,
      drugs_involved: false,
      abuse_involved: false,
      weapons_involved: false
    }
  });

  // Fetch criminals for selection
  const { data: criminalsData, isLoading: loadingCriminals } = useQuery({
    queryKey: ['criminals', criminalSearch],
    queryFn: async () => {
      const response = await fetch(`/api/criminals?search=${encodeURIComponent(criminalSearch)}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch criminals');
      }
      return response.json();
    },
  });

  // Submit report mutation
  const submitReportMutation = useMutation({
    mutationFn: async (reportData) => {
      const response = await fetch('/api/crime-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      reset();
      setSelectedCriminal(null);
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ['crime-reports'] });
    },
  });

  const onSubmit = (data) => {
    const reportData = {
      ...data,
      report_type: reportType,
      criminal_id: reportType === 'existing_criminal' ? selectedCriminal?.id : null,
      file_uploads: files.map(f => f.url),
      file_descriptions: files.map(f => f.description || f.name)
    };

    submitReportMutation.mutate(reportData);
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).map(file => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      description: ''
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Report Submitted</h1>
            <p className="text-gray-600">
              Your crime report has been successfully submitted and is being reviewed.
            </p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Crime Report</h1>
          <p className="text-gray-300">Help keep your community safe by reporting criminal activity</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Report Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Report Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setReportType('existing_criminal')}
              className={`p-6 border-2 rounded-lg transition-all ${
                reportType === 'existing_criminal'
                  ? 'border-black bg-black text-white shadow-lg'
                  : 'border-gray-300 bg-white text-black hover:border-black hover:shadow-md'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">Existing Criminal Activity</h3>
              <p className={`text-sm ${reportType === 'existing_criminal' ? 'text-gray-300' : 'text-gray-600'}`}>
                Report activity related to a known criminal from our database
              </p>
            </button>
            <button
              type="button"
              onClick={() => setReportType('new_crime')}
              className={`p-6 border-2 rounded-lg transition-all ${
                reportType === 'new_crime'
                  ? 'border-black bg-black text-white shadow-lg'
                  : 'border-gray-300 bg-white text-black hover:border-black hover:shadow-md'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">New Crime Report</h3>
              <p className={`text-sm ${reportType === 'new_crime' ? 'text-gray-300' : 'text-gray-600'}`}>
                Report new criminal activity or suspicious behavior
              </p>
            </button>
          </div>
        </div>

        {/* Criminal Selection (if existing criminal selected) */}
        {reportType === 'existing_criminal' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Select Criminal</h2>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search criminals by name or crime type..."
                  value={criminalSearch}
                  onChange={(e) => setCriminalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {loadingCriminals ? (
              <div className="text-center py-8">Loading criminals...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {criminalsData?.criminals?.map((criminal) => (
                  <div
                    key={criminal.id}
                    onClick={() => setSelectedCriminal(criminal)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedCriminal?.id === criminal.id
                        ? 'border-black bg-black text-white shadow-lg'
                        : 'border-gray-300 bg-white hover:border-black hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={criminal.headshot_url}
                        alt={criminal.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{criminal.name}</h3>
                        <p className={`text-sm ${selectedCriminal?.id === criminal.id ? 'text-gray-300' : 'text-gray-600'}`}>
                          {criminal.primary_crime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Report Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Required Fields */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-4">Required Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">
                  Description *
                  <span className="text-xs font-normal text-gray-600 block">
                    Include: Who, What, When, Where and How Do You Know
                  </span>
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Provide detailed information about the incident..."
                />
                {errors.description && (
                  <div className="mt-2 flex items-center text-red-600">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm">{errors.description.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Offense Type *</label>
                <select
                  {...register('offense_type', { required: 'Offense type is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">Select offense type</option>
                  {OFFENSE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.offense_type && (
                  <div className="mt-2 flex items-center text-red-600">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm">{errors.offense_type.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">City, State *</label>
                <input
                  type="text"
                  {...register('city_state', { required: 'City and state are required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="City, State"
                />
                {errors.city_state && (
                  <div className="mt-2 flex items-center text-red-600">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm">{errors.city_state.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-4">Location Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Address of Incident</label>
                <input
                  type="text"
                  {...register('incident_address')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">County</label>
                <input
                  type="text"
                  {...register('county')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="County"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Nearest Intersection</label>
                <input
                  type="text"
                  {...register('nearest_intersection')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Cross streets or intersection"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Neighborhood</label>
                <input
                  type="text"
                  {...register('neighborhood')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Neighborhood or subdivision"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Directions to Location</label>
                <textarea
                  {...register('directions_to_location')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Additional directions or landmarks"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-4">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">How did you hear about our program?</label>
                <select
                  {...register('how_heard_program')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">Select option</option>
                  {HOW_HEARD_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">News Story Links</label>
                <input
                  type="url"
                  {...register('news_story_links')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Copy/paste URL if available"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Additional Information</label>
                <textarea
                  {...register('additional_info')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Any other relevant information"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'school_related', label: 'School Related & Bullying' },
                { key: 'wanted_fugitive', label: 'Wanted/Fugitive' },
                { key: 'drugs_involved', label: 'Drugs' },
                { key: 'abuse_involved', label: 'Abuse' },
                { key: 'weapons_involved', label: 'Weapons' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(key)}
                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm font-medium text-black">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-4">File Upload</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload Limit: 100MB (File Types: Images, Videos, Audio, Documents)
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-black mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-600">Maximum file size: 100MB</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-gray-400" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={submitReportMutation.isLoading || (reportType === 'existing_criminal' && !selectedCriminal)}
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {submitReportMutation.isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>

          {submitReportMutation.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-800">
                <AlertCircle size={20} className="mr-2" />
                <span className="font-semibold">Error:</span>
                <span className="ml-2">{submitReportMutation.error.message}</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}