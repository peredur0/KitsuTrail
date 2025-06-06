SELECT
    reason,
    COUNT(*) AS records
FROM audit_logs
WHERE
    timestamp >= NOW() - INTERVAL '24 hours'
    AND user_id IS NOT NULL
    AND result = 'fail'
GROUP BY
    reason;