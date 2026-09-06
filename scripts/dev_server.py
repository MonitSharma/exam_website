#!/usr/bin/env python3
"""Local dev server for the static frontend.

Identical to `python -m http.server` except it sends `Cache-Control: no-store`
on every response. Without this, browsers heuristically cache the babel-loaded
`app/*.jsx` files, so edits don't show up on reload until a hard refresh.
"""

import http.server
import socketserver
import sys
import subprocess
import pathlib
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8001


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    os.chdir(pathlib.Path(__file__).resolve().parent.parent)
    subprocess.run(["npm", "run", "manifest"], check=True)
    subprocess.run(["npm", "run", "search-index"], check=True)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Dev server (no-cache) running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
