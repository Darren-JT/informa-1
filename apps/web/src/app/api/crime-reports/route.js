// Mock data for crime reports
const mockReports = [
  {
    id: 1,
    report_type: 'existing_criminal',
    criminal_id: 1,
    criminal_name: 'Marcus Johnson',
    criminal_headshot: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    criminal_crime: 'Armed Robbery',
    description: 'Witnessed armed robbery at 5th and Main Street. Suspect matching Marcus Johnson\'s description was seen fleeing northbound.',
    offense_type: 'Armed Robbery',
    incident_address: '123 Main Street',
    county: 'Manhattan',
    city_state: 'New York, NY',
    nearest_intersection: '5th Avenue and Main Street',
    neighborhood: 'Downtown',
    directions_to_location: 'Near the large bank building',
    how_heard_program: 'Internet',
    news_story_links: 'https://example.com/news/robbery-downtown',
    additional_info: 'Suspect was wearing a black hoodie and blue jeans',
    school_related: false,
    wanted_fugitive: true,
    suspect_info: 'Male, approximately 6 feet tall, black hair',
    vehicle_info: 'Fled on foot, no vehicle seen',
    drugs_involved: false,
    abuse_involved: false,
    weapons_involved: true,
    file_uploads: [],
    file_descriptions: [],
    location_lat: 40.7128,
    location_lng: -74.0060,
    status: 'pending',
    created_at: '2024-10-18T14:30:00Z'
  },
  {
    id: 2,
    report_type: 'new_crime',
    criminal_id: null,
    criminal_name: null,
    criminal_headshot: null,
    criminal_crime: null,
    description: 'Suspicious drug activity observed in alley behind apartment complex. Multiple individuals conducting what appeared to be drug transactions.',
    offense_type: 'Drugs - Cocaine',
    incident_address: '456 Oak Avenue',
    county: 'Brooklyn',
    city_state: 'Brooklyn, NY',
    nearest_intersection: 'Oak Avenue and 2nd Street',
    neighborhood: 'Park Slope',
    directions_to_location: 'Behind the red brick apartment building',
    how_heard_program: 'Word of Mouth',
    news_story_links: null,
    additional_info: 'Activity occurs mostly in evening hours between 6-9 PM',
    school_related: false,
    wanted_fugitive: false,
    suspect_info: 'Multiple individuals, ages appear to be 20-30',
    vehicle_info: 'Black sedan, license plate partially visible: ABC-***',
    drugs_involved: true,
    abuse_involved: false,
    weapons_involved: false,
    file_uploads: [],
    file_descriptions: [],
    location_lat: 40.6782,
    location_lng: -73.9442,
    status: 'pending',
    created_at: '2024-10-18T11:15:00Z'
  },
  {
    id: 3,
    report_type: 'existing_criminal',
    criminal_id: 2,
    criminal_name: 'Sarah Williams',
    criminal_headshot: 'https://images.pexels.com/photos/1844012/pexels-photo-1844012.jpeg?auto=compress&cs=tinysrgb&w=400',
    criminal_crime: 'Drug Trafficking',
    description: 'Sarah Williams spotted meeting with known associates in Washington Square Park. Appeared to be conducting business.',
    offense_type: 'Drug Trafficking',
    incident_address: 'Washington Square Park',
    county: 'Manhattan',
    city_state: 'New York, NY',
    nearest_intersection: 'Washington Square North and MacDougal Street',
    neighborhood: 'Greenwich Village',
    directions_to_location: 'Near the central fountain area',
    how_heard_program: 'Facebook',
    news_story_links: null,
    additional_info: 'Meeting lasted approximately 20 minutes',
    school_related: false,
    wanted_fugitive: true,
    suspect_info: 'Female, blonde hair, wearing black jacket',
    vehicle_info: 'Left in white SUV, license not visible',
    drugs_involved: true,
    abuse_involved: false,
    weapons_involved: false,
    file_uploads: [],
    file_descriptions: [],
    location_lat: 40.7308,
    location_lng: -73.9973,
    status: 'pending',
    created_at: '2024-10-18T09:45:00Z'
  },
  {
    id: 4,
    report_type: 'new_crime',
    criminal_id: null,
    criminal_name: null,
    criminal_headshot: null,
    criminal_crime: null,
    description: 'Break-in reported at local convenience store. Security cameras show masked individual forcing entry through rear door.',
    offense_type: 'Burglary',
    incident_address: '789 Broadway',
    county: 'Manhattan',
    city_state: 'New York, NY',
    nearest_intersection: 'Broadway and 14th Street',
    neighborhood: 'Union Square',
    directions_to_location: 'Corner store with green awning',
    how_heard_program: 'TV',
    news_story_links: 'https://example.com/news/burglary-union-square',
    additional_info: 'Occurred around 3 AM, cash register was targeted',
    school_related: false,
    wanted_fugitive: false,
    suspect_info: 'Unknown gender, approximately 5\'8", wearing all black',
    vehicle_info: 'Bicycle seen in security footage',
    drugs_involved: false,
    abuse_involved: false,
    weapons_involved: false,
    file_uploads: [],
    file_descriptions: [],
    location_lat: 40.7359,
    location_lng: -73.9911,
    status: 'pending',
    created_at: '2024-10-17T22:30:00Z'
  },
  {
    id: 5,
    report_type: 'new_crime',
    criminal_id: null,
    criminal_name: null,
    criminal_headshot: null,
    criminal_crime: null,
    description: 'Domestic violence incident reported by neighbor. Loud arguing and sounds of physical altercation heard from apartment 4B.',
    offense_type: 'Assault',
    incident_address: '321 Pine Street, Apt 4B',
    county: 'Queens',
    city_state: 'Queens, NY',
    nearest_intersection: 'Pine Street and Elm Avenue',
    neighborhood: 'Astoria',
    directions_to_location: 'Brown building, fourth floor',
    how_heard_program: 'Word of Mouth',
    news_story_links: null,
    additional_info: 'Incident occurred around 11 PM, police were called',
    school_related: false,
    wanted_fugitive: false,
    suspect_info: 'Male voice heard during altercation',
    vehicle_info: 'Unknown',
    drugs_involved: false,
    abuse_involved: true,
    weapons_involved: false,
    file_uploads: [],
    file_descriptions: [],
    location_lat: 40.7614,
    location_lng: -73.9776,
    status: 'pending',
    created_at: '2024-10-17T16:20:00Z'
  },
  {
    id: 6,
    report_type: 'existing_criminal',
    criminal_id: 4,
    criminal_name: 'Maria Rodriguez',
    criminal_headshot: 'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=400',
    criminal_crime: 'Human Trafficking',
    description: 'Maria Rodriguez seen at Port Authority with group of young women who appeared distressed and under supervision.',
    offense_type: 'Human Trafficking',
    incident_address: 'Port Authority Bus Terminal',
    county: 'Manhattan',
    city_state: 'New York, NY',
    nearest_intersection: '42nd Street and 8th Avenue',
    neighborhood: 'Midtown West',
    directions_to_location: 'Main terminal entrance',
    how_heard_program: 'Public Service Announcement',
    news_story_links: null,
    additional_info: 'Group appeared to be traveling together, women looked scared',
    school_related: false,
    wanted_fugitive: true,
    suspect_info: 'Female, Hispanic, 5\'6", dark hair',
    vehicle_info: 'Boarded bus heading to Philadelphia',
    drugs_involved: false,
    abuse_involved: true,
    weapons_involved: false,
    file_uploads: [],
    file_descriptions: [],
    location_lat: 40.7589,
    location_lng: -73.9851,
    status: 'pending',
    created_at: '2024-10-17T13:10:00Z'
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const search = searchParams.get('search') || '';

    // Filter reports based on search query
    let filteredReports = mockReports;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReports = mockReports.filter(report => 
        report.description.toLowerCase().includes(searchLower) ||
        report.offense_type.toLowerCase().includes(searchLower) ||
        (report.criminal_name && report.criminal_name.toLowerCase().includes(searchLower)) ||
        (report.city_state && report.city_state.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const paginatedReports = filteredReports.slice(offset, offset + limit);

    return Response.json({
      reports: paginatedReports,
      total: filteredReports.length,
      hasMore: offset + limit < filteredReports.length
    });
  } catch (error) {
    console.error('Error fetching crime reports:', error);
    return Response.json(
      { error: 'Failed to fetch crime reports' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.description || !body.offense_type || !body.city_state) {
      return Response.json(
        { error: 'Description, offense type, and city/state are required' },
        { status: 400 }
      );
    }

    // Create new report with mock ID
    const newReport = {
      id: mockReports.length + 1,
      report_type: body.report_type || 'new_crime',
      criminal_id: body.criminal_id || null,
      criminal_name: body.criminal_name || null,
      criminal_headshot: body.criminal_headshot || null,
      criminal_crime: body.criminal_crime || null,
      description: body.description,
      offense_type: body.offense_type,
      incident_address: body.incident_address || null,
      county: body.county || null,
      city_state: body.city_state,
      nearest_intersection: body.nearest_intersection || null,
      neighborhood: body.neighborhood || null,
      directions_to_location: body.directions_to_location || null,
      how_heard_program: body.how_heard_program || null,
      news_story_links: body.news_story_links || null,
      additional_info: body.additional_info || null,
      school_related: body.school_related || false,
      wanted_fugitive: body.wanted_fugitive || false,
      suspect_info: body.suspect_info || null,
      vehicle_info: body.vehicle_info || null,
      drugs_involved: body.drugs_involved || false,
      abuse_involved: body.abuse_involved || false,
      weapons_involved: body.weapons_involved || false,
      file_uploads: body.file_uploads || [],
      file_descriptions: body.file_descriptions || [],
      location_lat: body.location_lat || null,
      location_lng: body.location_lng || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // In a real app, this would be saved to database
    // For mock data, we'll just return the new report
    
    return Response.json({
      report: newReport,
      message: 'Crime report submitted successfully'
    });
  } catch (error) {
    console.error('Error creating crime report:', error);
    return Response.json(
      { error: 'Failed to create crime report' },
      { status: 500 }
    );
  }
}