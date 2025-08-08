FROM node:22.18.0-bookworm-slim AS base

ENV PROJECT_WORKSPACE="/workspace"
ADD uuv-command-builder.sh /

RUN mkdir $PROJECT_WORKSPACE && \
    export DEBIAN_FRONTEND=noninteractive && \
    echo "\n. /uuv-command-builder.sh\n" >> ~/.bashrc

WORKDIR $PROJECT_WORKSPACE

FROM base AS chromium
RUN apt-get update && \
    apt-get -y install --no-install-recommends \
        chromium \
        xvfb \
        git && \
    npx playwright install-deps chromium && \
    chromium --version && \
    rm -rf /var/lib/apt/lists/*

FROM base AS chrome
RUN apt-get update && \
    apt-get -y install --no-install-recommends \
        libgtk2.0-0 \
        libgtk-3-0 \
        libgbm-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        xauth \
        xvfb \
        wget \
        ca-certificates \
        fonts-liberation \
        libcurl3-gnutls \
        libu2f-udev \
        libvulkan1 \
        xdg-utils \
        git && \
    wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    rm -rf /var/lib/apt/lists/* && \
    dpkg -i google-chrome-stable_current_amd64.deb && \
    rm -f google-chrome-stable_current_amd64.deb && \
    google-chrome --version
