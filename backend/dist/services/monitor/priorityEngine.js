export function rankTheatres(config) {
    return [...config.theatres].sort((a, b) => b.priority - a.priority);
}
export function rankShowTimes(config) {
    return [...config.showTimes].sort((a, b) => b.priority - a.priority);
}
