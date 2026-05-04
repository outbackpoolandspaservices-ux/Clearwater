export type RouteWaypoint = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  serviceMinutes: number;
};

export type RoutePlan = {
  technicianId: string;
  date: string;
  waypoints: RouteWaypoint[];
};
