from rest_framework.views import exception_handler
from .response import api_error


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        message = 'An error occurred.'
        errors = {}

        if isinstance(response.data, dict):
            # DRF validation errors come as field: [errors]
            non_field = response.data.pop('non_field_errors', None)
            message = str(non_field[0]) if non_field else message
            errors = response.data
        elif isinstance(response.data, list):
            message = str(response.data[0])

        return api_error(message=message, status=response.status_code, errors=errors)

    return response
