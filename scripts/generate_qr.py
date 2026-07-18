#!/usr/bin/env python3
"""Generate the 20 pilot seat QR PNG files."""

from pathlib import Path
from urllib.parse import urlencode

import qrcode
from qrcode.constants import ERROR_CORRECT_H


BASE_URL = "https://dorivan2001.github.io/cafe/"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "qr" / "images"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for prefix in "ABCD":
        for number in range(1, 6):
            seat_id = f"{prefix}{number:03d}"
            url = f"{BASE_URL}?{urlencode({'seat': seat_id})}"
            qr = qrcode.QRCode(
                version=None,
                error_correction=ERROR_CORRECT_H,
                box_size=14,
                border=4,
            )
            qr.add_data(url)
            qr.make(fit=True)
            image = qr.make_image(fill_color="#003b78", back_color="white")
            image.save(OUTPUT_DIR / f"{seat_id}.png")


if __name__ == "__main__":
    main()
