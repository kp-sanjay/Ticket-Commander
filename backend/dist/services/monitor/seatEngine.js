export function pickSeatsUpperCenterAdjacency(grid, needed) {
    const rows = [...grid].sort((a, b) => a[0].rowLabel.localeCompare(b[0].rowLabel)).reverse();
    for (const row of rows) {
        const centerIndex = Math.floor(row.length / 2);
        const candidates = [];
        for (let offset = 0; offset < row.length; offset++) {
            const left = centerIndex - offset;
            const right = centerIndex + offset;
            const tryIndices = [];
            if (left >= 0)
                tryIndices.push(left);
            if (right < row.length)
                tryIndices.push(right);
            for (const idx of tryIndices) {
                if (row[idx].available)
                    candidates.push(row[idx]);
                if (candidates.length >= needed) {
                    const sorted = candidates.sort((a, b) => a.col - b.col);
                    const best = longestAdjacency(sorted);
                    if (best.length >= needed)
                        return { seats: best.slice(0, needed) };
                }
            }
        }
    }
    return { seats: [] };
}
function longestAdjacency(sorted) {
    let best = [];
    let current = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i === 0 || sorted[i].col === sorted[i - 1].col + 1) {
            current.push(sorted[i]);
        }
        else {
            if (current.length > best.length)
                best = current;
            current = [sorted[i]];
        }
    }
    if (current.length > best.length)
        best = current;
    return best;
}
