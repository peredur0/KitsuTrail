# coding: utf-8
"""
Entrypoint to know which process to start
- Init or API server
"""

import sys
import subprocess

mode = sys.argv[1] if len(sys.argv) > 1 else 'kuro'

match mode:
    case 'kuro':
        result = subprocess.run(
            ['fastapi', 'run', 'app/main.py'],
            cwd='Kuro'
        )
    case 'hatsuho':
        result = subprocess.run(['python', 'main.py'], cwd='Hatsuho')
    case _:
        print(f'Unknown command - {mode}', file=sys.stderr)
        sys.exit(1)

sys.exit(result.returncode)
