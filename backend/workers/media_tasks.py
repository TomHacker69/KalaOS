"""
Phase A worker task adapter for heavy creative jobs.

This module intentionally keeps a small, explicit task registry so API routes
can enqueue work without directly embedding compute-heavy logic.
"""

from typing import Any, Callable, Dict

from kalacore.kalaanimation import generate_animation_plan
from kalacore.kalaproducer import generate_ai_beat
from kalacore.kalavideo import generate_video_script
from kalacore.kalavisual import generate_image_concept


def _task_video_script(payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = str(payload.get("prompt", "")).strip()
    if not prompt:
        raise ValueError("payload.prompt is required for video_script_generation")
    return generate_video_script(prompt)


def _task_animation_plan(payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = str(payload.get("prompt", "")).strip()
    if not prompt:
        raise ValueError("payload.prompt is required for animation_plan_generation")
    style = str(payload.get("style", "cinematic")).strip() or "cinematic"
    duration = int(payload.get("duration_seconds", 30))
    return generate_animation_plan(prompt=prompt, style=style, duration_seconds=duration)


def _task_ai_beat(payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = str(payload.get("prompt", "")).strip()
    if not prompt:
        raise ValueError("payload.prompt is required for ai_beat_generation")
    return generate_ai_beat(prompt=prompt)


def _task_image_concept(payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = str(payload.get("prompt", "")).strip()
    if not prompt:
        raise ValueError("payload.prompt is required for image_concept_generation")
    style = str(payload.get("style", "")).strip() or None
    return generate_image_concept(prompt=prompt, style=style)


TASK_REGISTRY: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {
    "video_script_generation": _task_video_script,
    "animation_plan_generation": _task_animation_plan,
    "ai_beat_generation": _task_ai_beat,
    "image_concept_generation": _task_image_concept,
}


def run_task(task_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a registered task and return structured output."""
    handler = TASK_REGISTRY.get(task_type)
    if handler is None:
        raise ValueError(
            f"Unsupported task_type '{task_type}'. "
            f"Supported values: {', '.join(sorted(TASK_REGISTRY))}"
        )
    return handler(payload or {})

