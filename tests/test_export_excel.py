from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

payload = {
    "formData": {
        "income": 1200000,
        "section80C": 100000,
        "section80D": 20000,
        "hra": 0,
        "home_loan_interest": 0,
        "standard_deduction": 50000,
        "edu_loan_interest": 0,
        "donations": 0,
    },
    "taxResult": {
        "old_regime_tax": 117000,
        "new_regime_tax": 78600,
        "savings": 38400,
        "suggestions": ["Sample suggestion"]
    }
}

resp = client.post("/export/excel", json=payload)
print("status:", resp.status_code)
print("content-type:", resp.headers.get("content-type"))
print("content-length:", len(resp.content))
assert resp.status_code == 200
assert resp.headers.get("content-type", "").startswith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
assert len(resp.content) > 0
