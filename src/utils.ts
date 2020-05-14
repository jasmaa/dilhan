/**
 * Calculate control point for quad curve
 * 
 * @param x1 Node 1 x
 * @param y1 Node 1 y
 * @param x2 Node 2 x
 * @param y2 Node 2 y
 * @param d Distance from midpoint
 * @param n Edge number
 */
export function calculateControl(x1: number, y1: number, x2: number, y2: number, d: number, n: number) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const orthoSlope = -(x1 - x2) / (y1 - y2);

    const size = Math.pow(-1, n) * d * Math.floor((n + 1) / 2);

    if (y1 == y2) {
        return { x: midX, y: midY + size };
    } else {
        const w = size / Math.sqrt(1 + Math.pow(orthoSlope, 2));
        const h = orthoSlope * w;
        return { x: midX + w, y: midY + h };
    }
}