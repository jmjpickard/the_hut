import json

from ariadne import SchemaDirectiveVisitor
from jose import jwt
from six.moves.urllib.request import urlopen

from src.config import get_config


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header"""
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError(
            {
                "code": "authorization_header_missing",
                "description": "Authorization header is expected",
            },
            401,
        )

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must start with" " Bearer",
            },
            401,
        )
    elif len(parts) == 1:
        raise AuthError(
            {"code": "invalid_header", "description": "Token not found"}, 401
        )
    elif len(parts) > 2:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must be" " Bearer token",
            },
            401,
        )

    token = parts[1]
    return token


def verify(request):
    config = get_config()
    token = get_token_auth_header(request)
    issuer = f"{config['auth_domain']}/"
    jsonurl = urlopen(f"{issuer}.well-known/jwks.json")
    full_audience = f"https://{config['auth_audience']}"
    jwks = json.loads(jsonurl.read())
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms="RS256",
                audience=full_audience,
                issuer=issuer,
            )
        except jwt.ExpiredSignatureError:
            raise AuthError(
                {"code": "token_expired", "description": "token is expired"}, 401
            )
        except Exception:
            raise AuthError(
                {
                    "code": "invalid_header",
                    "description": "Unable to parse authentication" " token.",
                },
                401,
            )

        return payload
    raise AuthError(
        {"code": "invalid_header", "description": "Unable to find appropriate key"}, 401
    )


class IsAuthenticatedDirective(SchemaDirectiveVisitor):
    def visit_field_definition(self, field, object_type):
        original_resolver = field.resolve

        def resolve_is_authenticated(obj, info, **kwargs):
            user = info.context.get("user")
            if user is None:
                raise Exception("Unauthorized user")
            result = original_resolver(obj, info, **kwargs)
            return result

        field.resolve = resolve_is_authenticated
        return field
