# Use the official Python image as base
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install virtualenv
RUN apt-get update && apt-get install -y python3-venv

# Copy the content of the local directory to the working directory
COPY . .

# Create and activate the virtual environment
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the Flask application
CMD ["python", "app.py"]
