import { AppConfig, TheatrePreference, ShowTimePreference } from '../../utils/types.js'

export function rankTheatres(config: AppConfig): TheatrePreference[] {
  return [...config.theatres].sort((a, b) => b.priority - a.priority)
}

export function rankShowTimes(config: AppConfig): ShowTimePreference[] {
  return [...config.showTimes].sort((a, b) => b.priority - a.priority)
}

