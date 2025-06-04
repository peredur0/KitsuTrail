WITH activity AS (
    SELECT 
        provider_id,
        COUNT(*) FILTER (WHERE result = 'success') AS success,
        COUNT(*) FILTER (WHERE result = 'fail') AS failure
    FROM audit_logs
    WHERE
        timestamp >= NOW() - INTERVAL '24 hours'
        AND user_id IS NOT NULL
    GROUP BY
        provider_id
)
SELECT
    p.name,
    p.type,
    COALESCE(a.success, 0) AS success,
    COALESCE(a.failure, 0) AS failure
FROM providers p
LEFT JOIN activity a ON p.id = a.provider_id
ORDER BY (a.success + a.failure) DESC;
