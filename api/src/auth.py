import json
import urllib

from jose import jwt
from six.moves.urllib.request import urlopen
from fastapi import HTTPException, Header

from src.logger import logger
from src.config import get_config


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header(auth: str):
    """Obtains the Access Token from the Authorization Header"""

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


def verify(authorisation: str):
    if authorisation == "na":
        return AuthError({"code": "failed_auth", "description": f"NA Token"}, 401)

    config = get_config()
    token = get_token_auth_header(authorisation)
    with urllib.request.urlopen(
        f"{config['auth_domain']}/.well-known/jwks.json"
    ) as response:
        jwks = json.loads(response.read())
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
                return jwt.decode(
                    token,
                    rsa_key,
                    algorithms="RS256",
                    audience=f"{config['auth_audience']}/",
                    issuer=f"{config['auth_domain']}/",
                )
            except jwt.ExpiredSignatureError:
                return AuthError(
                    {"code": "token_expired", "description": "token is expired"}, 401
                )
            except Exception as err:
                return AuthError(
                    {
                        "code": "failed_auth",
                        "description": f"Unable to verify token: {str(err)}",
                    },
                    401,
                )


async def optional_verify_token(authorization: str = Header(...)):
    logger.info(f"Started optional_verify_token")
    payload = verify(authorization)

    logger.info(f"User verify token endpoint reached: {str(payload)}")
    # return "hello"
    return {"logged_in": not isinstance(payload, AuthError)}
