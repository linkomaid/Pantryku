const requests = new Map();


export function rateLimit(ip, limit = 5, windowMs = 60000) {

    const now = Date.now();


    if (!requests.has(ip)) {
        requests.set(ip, []);
    }


    const timestamps = requests
        .get(ip)
        .filter(time => now - time < windowMs);


    timestamps.push(now);

    requests.set(ip, timestamps);


    return {
        success: timestamps.length <= limit,
        remaining: Math.max(0, limit - timestamps.length)
    };
}