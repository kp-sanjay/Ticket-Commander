export type SeatPreference = {
  rowPreference: 'upper' | 'middle' | 'lower'
  positionPreference: 'center' | 'left' | 'right'
  count: number
}

export type TheatrePreference = {
  name: string
  priority: number
}

export type ShowTimePreference = {
  time: string
  priority: number
}

export type AppConfig = {
  movieName: string
  region: string
  theatres: TheatrePreference[]
  showTimes: ShowTimePreference[]
  seatPreference: SeatPreference
  autoMonitorEnabled: boolean
  simulation: boolean
}

