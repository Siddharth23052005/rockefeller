import json
import os
from pathlib import Path
from typing import Generator

from dotenv import load_dotenv
from fastapi import HTTPException
from groq import Groq


BACKEND_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_ROOT / ".env")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def _require_client() -> Groq:
    if groq_client is None:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")
    return groq_client


def _risk_prompt(zone_name: str, risk_level: str, features: dict) -> str:
    return (
        "You are a mine safety assistant. Explain in simple words for a mine worker.\n"
        f"Zone: {zone_name}\n"
        f"Risk level: {risk_level}\n"
        "Features:\n"
        f"- rainfall_mm_24h: {features.get('rainfall_mm_24h', 0)}\n"
        f"- blast_count_7d: {features.get('blast_count_7d', 0)}\n"
        f"- avg_crack_score: {features.get('avg_crack_score', 0)}\n"
        f"- is_monsoon: {features.get('is_monsoon', False)}\n"
        f"- days_since_inspection: {features.get('days_since_inspection', 0)}\n\n"
        "Write 3-4 short sentences: why this risk level is assigned and one practical precaution workers should take now."
    )


def generate_risk_summary(zone_name: str, risk_level: str, features: dict) -> str:
    client = _require_client()
    prompt = _risk_prompt(zone_name=zone_name, risk_level=risk_level, features=features)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.4,
            max_tokens=200,
            messages=[
                {
                    "role": "system",
                    "content": "You provide clear and safety-focused explanations for mine workers.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        return (response.choices[0].message.content or "").strip()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Groq request failed: {exc}")


def generate_alert_explanation(alert_type: str, zone_name: str, trigger_reason: str) -> str:
    client = _require_client()
    prompt = (
        "Write a short plain-English alert message for a mine worker.\n"
        f"Alert type: {alert_type}\n"
        f"Zone: {zone_name}\n"
        f"Trigger reason: {trigger_reason}\n\n"
        "Write exactly 2 short sentences: what happened and what action to take immediately."
    )

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=100,
            messages=[
                {
                    "role": "system",
                    "content": "You write concise, worker-friendly mine safety alerts.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        return (response.choices[0].message.content or "").strip()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Groq request failed: {exc}")


def _fallback_crack_remarks(zone_name: str, crack_type: str, severity: str, observations: str) -> str:
    safe_zone = zone_name.strip() or "selected zone"
    safe_type = crack_type.replace("_", " ").strip() or "surface crack"
    safe_severity = severity.strip().lower() or "low"
    safe_observations = observations.strip() or "Initial visual indicators were captured by the field team."

    return (
        f"Preliminary inspection at {safe_zone} identified a {safe_type} pattern with {safe_severity} severity. "
        f"Field observation: {safe_observations[:240]} "
        "Area should be barricaded and monitored until engineering verification is completed. "
        "Recommend follow-up photo comparison and slope stability check in the next inspection cycle."
    )


def generate_crack_remarks(zone_name: str, crack_type: str, severity: str, observations: str) -> dict[str, str]:
    fallback = _fallback_crack_remarks(zone_name, crack_type, severity, observations)

    if groq_client is None:
        return {
            "remarks": fallback,
            "source": "fallback",
            "note": "GROQ_API_KEY is not configured. Returned fallback remarks.",
        }

    prompt = (
        "You are a mine geotechnical assistant. "
        "Generate concise technical remarks for a crack report. "
        "Keep it to 3-4 sentences in plain, field-friendly English. "
        "Mention risk implication and immediate next actions.\n"
        f"Zone: {zone_name}\n"
        f"Crack type: {crack_type}\n"
        f"Severity: {severity}\n"
        f"Observed notes: {observations or 'Minimal field input provided.'}\n"
    )

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.35,
            max_tokens=260,
            messages=[
                {
                    "role": "system",
                    "content": "You write practical and precise crack assessment remarks for mine safety teams.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        generated = (response.choices[0].message.content or "").strip()
        return {
            "remarks": generated or fallback,
            "source": "groq",
        }
    except Exception:
        return {
            "remarks": fallback,
            "source": "fallback",
            "note": "Groq request failed. Returned fallback remarks.",
        }


def stream_risk_summary(zone_name: str, risk_level: str, features: dict) -> Generator[str, None, None]:
    client = _require_client()
    prompt = _risk_prompt(zone_name=zone_name, risk_level=risk_level, features=features)

    try:
        stream = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            temperature=0.4,
            max_tokens=200,
            stream=True,
            messages=[
                {
                    "role": "system",
                    "content": "You provide clear and safety-focused explanations for mine workers.",
                },
                {"role": "user", "content": prompt},
            ],
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Groq request failed: {exc}")

    for chunk in stream:
        try:
            token = chunk.choices[0].delta.content if chunk.choices else None
        except Exception:
            token = None

        if token:
            yield f"data: {json.dumps({'token': token})}\n\n"

    yield "data: [DONE]\n\n"