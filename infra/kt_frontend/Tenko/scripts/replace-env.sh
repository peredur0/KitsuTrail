#!/bin/sh

sed -i "s|KITSUTRAIL__API__URL|${KITSUTRAIL__API__URL:-http://localhost:8000}|g" /usr/share/nginx/html/assets/config.json
exec "$@"