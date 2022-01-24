# our base image
FROM python:3.9.6 as base_image

WORKDIR /app
COPY ./Pipfile .

ENV PIPENV_VENV_IN_PROJECT=true

RUN pip install pipenv
RUN pipenv install --deploy --skip-lock

# use base image to run app
FROM python:3.9.6
WORKDIR /app
RUN pip install pipenv

COPY --from=base_image /app /app
COPY ./src ./src

EXPOSE 8000

ENV PATH="/app/.venv/bin:$PATH" 

CMD uvicorn src.main:app --host 0.0.0.0 --port 8000
