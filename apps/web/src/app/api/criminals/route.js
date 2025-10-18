// Mock data for criminals
const mockCriminals = [
  {
    id: 1,
    name: 'Marcus Johnson',
    headshot_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Armed Robbery',
    description: 'Wanted for multiple armed robberies in downtown area. Last seen carrying a black backpack.',
    location_lat: 40.7128,
    location_lng: -74.0060,
    status: 'active',
    created_at: '2024-10-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    headshot_url: 'https://images.pexels.com/photos/1844012/pexels-photo-1844012.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Drug Trafficking',
    description: 'Suspected of operating large-scale drug distribution network across multiple neighborhoods.',
    location_lat: 40.7589,
    location_lng: -73.9851,
    status: 'active',
    created_at: '2024-10-14T15:45:00Z'
  },
  {
    id: 3,
    name: 'David Chen',
    headshot_url: 'https://images.pexels.com/photos/1839994/pexels-photo-1839994.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Fraud',
    description: 'Involved in financial fraud targeting elderly victims through phone scams.',
    location_lat: 40.7505,
    location_lng: -73.9934,
    status: 'active',
    created_at: '2024-10-13T09:20:00Z'
  },
  {
    id: 4,
    name: 'Maria Rodriguez',
    headshot_url: 'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Human Trafficking',
    description: 'Suspected leader of human trafficking operation with international connections.',
    location_lat: 40.7282,
    location_lng: -74.0776,
    status: 'active',
    created_at: '2024-10-12T14:10:00Z'
  },
  {
    id: 5,
    name: 'James Thompson',
    headshot_url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Assault',
    description: 'Multiple assault charges and domestic violence incidents. Considered dangerous.',
    location_lat: 40.7831,
    location_lng: -73.9712,
    status: 'active',
    created_at: '2024-10-11T11:55:00Z'
  },
  {
    id: 6,
    name: 'Lisa Park',
    headshot_url: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Kidnapping',
    description: 'Suspected of kidnapping involving ransom demands. High priority case.',
    location_lat: 40.7614,
    location_lng: -73.9776,
    status: 'active',
    created_at: '2024-10-10T16:30:00Z'
  },
  {
    id: 7,
    name: 'Robert Brown',
    headshot_url: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Burglary',
    description: 'Serial burglar targeting residential homes in affluent neighborhoods.',
    location_lat: 40.7580,
    location_lng: -73.9855,
    status: 'active',
    created_at: '2024-10-09T08:45:00Z'
  },
  {
    id: 8,
    name: 'Amanda Foster',
    headshot_url: 'https://images.pexels.com/photos/1845234/pexels-photo-1845234.jpeg?auto=compress&cs=tinysrgb&w=400',
    primary_crime: 'Arson',
    description: 'Suspected arsonist responsible for multiple commercial building fires.',
    location_lat: 40.7489,
    location_lng: -73.9680,
    status: 'active',
    created_at: '2024-10-08T13:25:00Z'
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Filter criminals based on search query
    let filteredCriminals = mockCriminals;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCriminals = mockCriminals.filter(criminal => 
        criminal.name.toLowerCase().includes(searchLower) ||
        criminal.primary_crime.toLowerCase().includes(searchLower) ||
        (criminal.description && criminal.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply limit
    const limitedCriminals = filteredCriminals.slice(0, limit);

    return Response.json({
      criminals: limitedCriminals,
      total: filteredCriminals.length,
      hasMore: filteredCriminals.length > limit
    });
  } catch (error) {
    console.error('Error fetching criminals:', error);
    return Response.json(
      { error: 'Failed to fetch criminals' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.primary_crime) {
      return Response.json(
        { error: 'Name and primary crime are required' },
        { status: 400 }
      );
    }

    // Create new criminal with mock ID
    const newCriminal = {
      id: mockCriminals.length + 1,
      name: body.name,
      headshot_url: body.headshot_url || null,
      primary_crime: body.primary_crime,
      description: body.description || null,
      location_lat: body.location_lat || null,
      location_lng: body.location_lng || null,
      status: 'active',
      created_at: new Date().toISOString()
    };

    // In a real app, this would be saved to database
    // For mock data, we'll just return the new criminal
    
    return Response.json({
      criminal: newCriminal,
      message: 'Criminal added successfully'
    });
  } catch (error) {
    console.error('Error creating criminal:', error);
    return Response.json(
      { error: 'Failed to create criminal' },
      { status: 500 }
    );
  }
}