export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteData {
  distanceMeters: number;
  durationSeconds: number;
  provider: string;
}

export interface MapProvider {
  geocode(query: string): Promise<Coordinates>;
  getRoute(origin: Coordinates, destination: Coordinates): Promise<RouteData>;
}

// Mock provider since we lack API credentials.
// The integration is marked as PENDING CONFIGURATION
export class MockMapProvider implements MapProvider {
  async geocode(query: string): Promise<Coordinates> {
    return { latitude: 0, longitude: 0 };
  }

  async getRoute(origin: Coordinates, destination: Coordinates): Promise<RouteData> {
    return {
      distanceMeters: 10000,
      durationSeconds: 1200,
      provider: 'mock-provider (PENDING CONFIGURATION)'
    };
  }
}

export class MapService {
  private provider: MapProvider;

  constructor(provider?: MapProvider) {
    this.provider = provider || new MockMapProvider();
  }

  async getRoute(origin: Coordinates, destination: Coordinates): Promise<RouteData> {
    // Basic validation
    if (origin.latitude === undefined || origin.longitude === undefined || destination.latitude === undefined || destination.longitude === undefined) {
      throw new Error('Invalid coordinates');
    }
    return this.provider.getRoute(origin, destination);
  }
}
