import os


def get_config():
    return {
        "auth_client_id": os.environ["AUTH0_CLIENT_ID"],
        "auth_client_secret": os.environ["AUTH0_CLIENT_SECRET"],
        "auth_domain": os.environ["AUTH0_DOMAIN"],
        "auth_audience": os.environ["AUTH0_AUDIENCE"],
        "auth_database": os.environ["AUTH0_DATABASE"]
    }
