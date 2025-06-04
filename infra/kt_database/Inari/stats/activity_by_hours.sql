WITH hours AS (
    SELECT generate_series(
        date_trunc('hour', NOW() - INTERVAL '24 hours'),
        date_trunc('hour', NOW()),
        INTERVAL '1 hour'
    ) AS hour
),
events AS (
    SELECT
        date_trunc('hour', timestamp) AS hour,
        COUNT(*) FILTER (WHERE action = 'authentication') AS authentications,
        COUNT(*) FILTER (WHERE action = 'access') AS access
        FROM audit_logs
    WHERE
        timestamp >= NOW() - INTERVAL '24 hours'
        AND user_id IS NOT NULL
    GROUP BY hour
)
SELECT
    TO_CHAR(h.hour, 'YYYY-MM-DD HH24:00') AS hours,
    COALESCE(e.authentications, 0) AS authentications,
    COALESCE(e.access, 0) AS access
FROM hours h
LEFT JOIN events e ON h.hour = e.hour
ORDER BY h.hour;
