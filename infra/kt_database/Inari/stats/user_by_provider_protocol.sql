WITH protocols AS (
    SELECT 
        DISTINCT protocol
    FROM providers
),
types AS (
    SELECT 
        DISTINCT type
    FROM providers
),
combined AS (
    SELECT
        t.type,
        p.protocol
    FROM
        types t
    CROSS JOIN protocols p
),
users_per_providers AS (
    SELECT
        provider_type,
        provider_protocol,
        COUNT(DISTINCT(user_id)) AS users
    FROM audit_logs
    WHERE
        result = 'success'
        AND provider_id IS NOT NULL
    GROUP BY
        provider_type,
        provider_protocol
)
SELECT
    c.type,
    c.protocol,
    COALESCE(u.users, 0) AS users
FROM combined c
LEFT JOIN users_per_providers u
    ON c.type = u.provider_type
    AND c.protocol = u.provider_protocol;