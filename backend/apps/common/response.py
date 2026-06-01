from rest_framework.response import Response


def api_response(data=None, message='', status=200, success=True):
    return Response({
        'success': success,
        'message': message,
        'data': data,
    }, status=status)


def api_error(message='An error occurred.', status=400, errors=None):
    return Response({
        'success': False,
        'message': message,
        'errors': errors or {},
    }, status=status)
