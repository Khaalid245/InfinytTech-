import math

from rest_framework.exceptions import Throttled
from rest_framework.views import exception_handler

from .response import api_error


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    # -----------------------------------------------------------------------
    # HTTP 429 — Rate Limit Exceeded
    # Return a structured JSON body and the standard Retry-After header.
    # -----------------------------------------------------------------------
    if isinstance(exc, Throttled):
        wait = math.ceil(exc.wait) if exc.wait is not None else 60
        retry_msg = (
            f'Request limit exceeded. Please retry after {wait} second(s).'
        )
        throttle_response = api_error(
            message=retry_msg,
            status=429,
            errors={
                'error': 'rate_limit_exceeded',
                'retry_after_seconds': wait,
            },
        )
        throttle_response['Retry-After'] = str(wait)
        throttle_response['X-RateLimit-Reset'] = str(wait)
        return throttle_response

    # -----------------------------------------------------------------------
    # All other errors — preserve existing behaviour.
    # -----------------------------------------------------------------------
    message = 'An error occurred.'
    errors = {}

    if isinstance(response.data, dict):
        non_field = response.data.pop('non_field_errors', None)
        detail = response.data.pop('detail', None)
        if non_field:
            message = str(non_field[0])
        elif detail:
            message = str(detail)
        errors = response.data
    elif isinstance(response.data, list):
        message = str(response.data[0])

    return api_error(message=message, status=response.status_code, errors=errors)
