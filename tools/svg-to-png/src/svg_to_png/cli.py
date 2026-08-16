from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Optional
from xml.etree import ElementTree


BROWSER_PATHS = (
    Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    Path("/Applications/Chromium.app/Contents/MacOS/Chromium"),
    Path("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"),
)


def positive_number(value: str) -> float:
    number = float(value)
    if number <= 0:
        raise argparse.ArgumentTypeError("value must be greater than zero")
    return number


def parser() -> argparse.ArgumentParser:
    command = argparse.ArgumentParser(
        prog="svg-to-png",
        description="Render an SVG to PNG with a real browser and your installed fonts.",
    )
    command.add_argument("input", type=Path, help="SVG file to convert")
    command.add_argument("output", type=Path, nargs="?", help="Output PNG; defaults beside the SVG")
    command.add_argument("--width", type=positive_number, help="Output width in pixels")
    command.add_argument("--height", type=positive_number, help="Output height in pixels")
    command.add_argument("--scale", type=positive_number, default=1, help="Scale intrinsic dimensions (default: 1)")
    command.add_argument("--background", help="CSS background color; transparent by default")
    command.add_argument("--browser", type=Path, help="Path to Chrome, Chromium, or Edge")
    return command


def numeric_svg_length(value: Optional[str]) -> Optional[float]:
    if not value:
        return None
    match = re.fullmatch(r"\s*([0-9]*\.?[0-9]+)(?:px)?\s*", value)
    return float(match.group(1)) if match else None


def intrinsic_size(source: Path) -> tuple[float, float]:
    root = ElementTree.parse(source).getroot()
    width = numeric_svg_length(root.get("width"))
    height = numeric_svg_length(root.get("height"))
    if width and height:
        return width, height
    view_box = root.get("viewBox")
    if view_box:
        values = [float(value) for value in re.split(r"[\s,]+", view_box.strip())]
        if len(values) == 4 and values[2] > 0 and values[3] > 0:
            return values[2], values[3]
    raise ValueError("SVG needs numeric width/height attributes or a valid viewBox")


def find_browser(requested: Optional[Path]) -> Path:
    if requested:
        browser = requested.expanduser().resolve()
        if browser.is_file():
            return browser
        raise FileNotFoundError(f"browser not found: {browser}")
    for browser in BROWSER_PATHS:
        if browser.is_file():
            return browser
    for command in ("google-chrome", "chromium", "chromium-browser", "microsoft-edge"):
        located = shutil.which(command)
        if located:
            return Path(located)
    raise FileNotFoundError("Chrome, Chromium, or Edge is required")


def output_size(source: Path, width: Optional[float], height: Optional[float], scale: float) -> tuple[int, int]:
    intrinsic_width, intrinsic_height = intrinsic_size(source)
    ratio = intrinsic_width / intrinsic_height
    if width and height:
        return round(width), round(height)
    if width:
        return round(width), round(width / ratio)
    if height:
        return round(height * ratio), round(height)
    return round(intrinsic_width * scale), round(intrinsic_height * scale)


def render(arguments: argparse.Namespace) -> Path:
    source = arguments.input.expanduser().resolve()
    destination = (arguments.output or source.with_suffix(".png")).expanduser().resolve()
    if source.suffix.lower() != ".svg" or not source.is_file():
        raise ValueError(f"input SVG not found: {source}")
    if destination.suffix.lower() != ".png":
        raise ValueError("output must be a .png file")

    width, height = output_size(source, arguments.width, arguments.height, arguments.scale)
    svg = source.read_text(encoding="utf-8")
    background = arguments.background or "transparent"
    html = f"""<!doctype html><html><head><meta charset=\"utf-8\"><style>
html,body{{margin:0;width:{width}px;height:{height}px;overflow:hidden;background:{background}}}
svg{{display:block;width:{width}px!important;height:{height}px!important}}
</style></head><body>{svg}</body></html>"""

    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        destination.unlink()
    browser = find_browser(arguments.browser)
    with tempfile.TemporaryDirectory(prefix="svg-to-png-") as directory:
        page = Path(directory) / "render.html"
        profile = Path(directory) / "profile"
        log_path = Path(directory) / "browser.log"
        page.write_text(html, encoding="utf-8")
        with log_path.open("w", encoding="utf-8") as log:
            process = subprocess.Popen(
                [
                    str(browser), "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--allow-file-access-from-files", f"--user-data-dir={profile}",
                    f"--window-size={width},{height}", "--force-device-scale-factor=1",
                    "--default-background-color=00000000", "--virtual-time-budget=1000",
                    f"--screenshot={destination}", page.as_uri(),
                ],
                stdout=log, stderr=subprocess.STDOUT, text=True,
            )
            previous_size = -1
            stable_checks = 0
            deadline = time.monotonic() + 20
            while time.monotonic() < deadline:
                if destination.is_file():
                    current_size = destination.stat().st_size
                    stable_checks = stable_checks + 1 if current_size > 0 and current_size == previous_size else 0
                    previous_size = current_size
                    if stable_checks >= 3:
                        break
                if process.poll() is not None and not destination.is_file():
                    break
                time.sleep(0.1)
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=3)
        if not destination.is_file() or destination.stat().st_size == 0:
            detail = log_path.read_text(encoding="utf-8").strip() or "browser rendering failed"
            raise RuntimeError(detail)
    return destination


def main() -> None:
    try:
        destination = render(parser().parse_args())
    except (OSError, RuntimeError, ValueError) as error:
        print(f"svg-to-png: {error}", file=sys.stderr)
        raise SystemExit(1) from error
    print(destination)


if __name__ == "__main__":
    main()
