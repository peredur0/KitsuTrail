WITH users AS (
    SELECT login FROM users
),
activity AS (
    SELECT
        user_login,
        COUNT(*) FILTER(WHERE action = 'authentication' AND result = 'success') AS authentication,
        COUNT(*) FILTER(WHERE action = 'access' AND result = 'success') AS access,
        COUNT(*) FILTER(WHERE result = 'fail') AS failure,
        COUNT(*) FILTER(WHERE category = 'autorisation')AS events
    FROM audit_logs
    WHERE
        timestamp >= NOW() - INTERVAL '24 hours'
        AND user_id IS NOT NULL
    GROUP BY user_login
)
SELECT
    u.login,
    COALESCE(a.authentication, 0) AS authentication,
    COALESCE(a.access, 0) AS access,
    COALESCE(a.failure, 0) AS failure,
    COALESCE(a.events, 0) AS events
FROM users u
LEFT JOIN activity a
    ON u.login = a.user_login
ORDER BY
    events DESC;