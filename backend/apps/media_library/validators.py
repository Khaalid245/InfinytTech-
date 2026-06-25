import os
import mimetypes
from django.core.exceptions import ValidationError

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf']

ALLOWED_MIME_TYPES = {
    'jpg': ['image/jpeg'],
    'jpeg': ['image/jpeg'],
    'png': ['image/png'],
    'webp': ['image/webp'],
    'svg': ['image/svg+xml'],
    'pdf': ['application/pdf'],
}


def validate_file_size(value):
    """
    Enforces maximum upload size constraints.
    """
    if value.size > MAX_FILE_SIZE:
        raise ValidationError(f"File size exceeds the maximum limit of 10MB (file size was {value.size / (1024*1024):.1f}MB).")


def validate_file_extension(value):
    """
    Enforces file extension whitelists.
    """
    ext = os.path.splitext(value.name)[1].lower().lstrip('.')
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(f"Extension .{ext} is not allowed. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}.")


def validate_mime_type(file_obj, filename):
    """
    Compares filename extension with actual MIME type to block extension spoofing attacks.
    """
    ext = os.path.splitext(filename)[1].lower().lstrip('.')
    guessed_type, _ = mimetypes.guess_type(filename)
    
    # 1. Block spoofing where MIME is not in whitelisted mapping
    if ext not in ALLOWED_MIME_TYPES:
        raise ValidationError(f"Unsupported file format: .{ext}")

    valid_types = ALLOWED_MIME_TYPES[ext]
    
    # Simple check on the upload file's declared content_type
    declared_type = getattr(file_obj, 'content_type', None)
    if declared_type and declared_type not in valid_types:
        raise ValidationError(
            f"File extension and MIME type mismatch. Expected one of {valid_types} for extension .{ext}, but received '{declared_type}'."
        )
