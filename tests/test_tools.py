import json
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "data" / "tools.json"


def load():
    return json.loads(DATA.read_text(encoding="utf-8"))


def test_required_fields():
    for t in load():
        for key in ("name", "category", "use", "license"):
            assert t.get(key), f"{t.get('name')} 항목에 {key} 없음"


def test_unique_names():
    names = [t["name"] for t in load()]
    assert len(names) == len(set(names))


def test_item_count():
    assert len(load()) == 62
