
class UploadError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.name = "UploadError";
        this.statusCode = statusCode;
    }
}


function formatDate(date) { // expected format 2026-05-30T07:37:50.156Z

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (date.length === 10) { // for 2026-05-30 only

        const [year, month, day] = date.split("-");

        return `${day}-${months[parseInt(month) - 1]}-${year}`;

    }

    return date;
}


function convertToISO(dateStr) {

    const months = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04",
        May: "05", Jun: "06", Jul: "07", Aug: "08",
        Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };

    if (dateStr.length === 11) { // 03-Mar-2008
        const [day, mon, year] = dateStr.split("-");

        return `${year}-${months[mon]}-${day.padStart(2, "0")}`;
    }

    return dateStr;
}


/** miliseconds to readable date, 3600*1000 -> 1 hour */
function formatDuration(ms, format = "long", precision = "accurate") {

    let totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const isShort = format === "short";
    const isMedium = format === "medium";
    const isLong = format === "long";

    const units = {
        day: isShort ? "d" : isMedium ? " day" : " day",
        hour: isShort ? "h" : isMedium ? " hr" : " hour",
        minute: isShort ? "m" : isMedium ? " min" : " minute",
        second: isShort ? "s" : isMedium ? " sec" : " second",
    };

    const pluralize = (value, label) => {
        if (isShort) return `${value}${label}`;

        if (isMedium) return `${value}${label}`;

        // long
        return `${value}${label}${value !== 1 ? "s" : ""}`;
    };

    const parts = [];

    function push(value, key) {
        if (value > 0) parts.push({ value, key });
    }

    push(days, "day");
    push(hours, "hour");
    push(minutes, "minute");
    push(seconds, "second");

    if (parts.length === 0) {
        return isShort ? "0s" : isMedium ? "0 sec" : "0 seconds";
    }

    // -----------------------------
    // SMART MODE LOGIC
    // -----------------------------
    if (precision === "smart") {
        const largest = parts[0].key;

        // If only seconds → show seconds only
        if (largest === "second") {
            return isShort
                ? `${seconds}s`
                : isMedium
                    ? `${seconds} sec`
                    : pluralize(seconds, units.second);
        }

        // If minutes is largest → show minutes + seconds
        if (largest === "minute") {
            const out = [];

            if (minutes) out.push(pluralize(minutes, units.minute));
            if (seconds) out.push(pluralize(seconds, units.second));

            return out.join(" ");
        }

        // If hours is largest → show hours + minutes (ignore seconds usually)
        if (largest === "hour") {
            const out = [];

            if (hours) out.push(pluralize(hours, units.hour));
            if (minutes) out.push(pluralize(minutes, units.minute));

            return out.join(" ");
        }

        // If days or more → show only biggest units (days/weeks style)
        if (largest === "day") {
            return isShort
                ? `${days}d`
                : isMedium
                    ? `${days} day${days !== 1 ? "s" : ""}`
                    : pluralize(days, units.day);
        }
    }

    // -----------------------------
    // ACCURATE MODE (default)
    // -----------------------------
    return parts
        .map(p => pluralize(p.value, units[p.key]))
        .join(" ");
}

function showRoutes(req, res, next) {

    console.log("----------------------------------------");

    console.log(`${req.method}: ${req.baseUrl}${req.route.path}`);

    next();
}

export { UploadError, formatDate, convertToISO, formatDuration, showRoutes };