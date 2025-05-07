FROM python:3.13.3-bullseye

# Set the environment variables
ENV PYHTONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    ninja-build \
    ffmpeg \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libjpeg-dev \
    libpng-dev \
    libwebp-dev \
    libopenblas-dev \
    libtiff-dev \
    zlib1g-dev \
    libfreetype6-dev \
    python3-dev \
 && rm -rf /var/lib/apt/lists/*

# Install Tesseract OCR
RUN apt-get update && \
    apt-get install -y wget lsb-release gnupg curl && \
    echo "deb https://notesalexp.org/tesseract-ocr5/$(lsb_release -cs)/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/tesseract.list && \
    wget -O- https://notesalexp.org/debian/alexp_key.asc | apt-key add - && \
    apt-get update && \
    apt-get install -y tesseract-ocr libtesseract-dev tesseract-ocr-eng

# Install additional image processing libraries
RUN apt-get install -y \
    libjpeg-turbo-progs \
    libpng-dev \
    libtiff-dev \
    libwebp-dev \
    libopenjp2-7 \
    libgif-dev

# Install dataset for Tesseract OCR
RUN mkdir -p /usr/share/tesseract-ocr/4.00/tessdata && \
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata \
https://github.com/tesseract-ocr/tessdata_best/raw/main/eng.traineddata

# Upgrade pip
RUN pip install --upgrade pip

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Install additional Python packages
RUN pip install opencv-python-headless

COPY . .
EXPOSE 8000:8000

# Run the application using uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]