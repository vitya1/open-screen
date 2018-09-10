#!/bin/bash

cd web/ && yarn
cd ../scraper/ && yarn
cd ../smart/ && yarn
cd ../front/ && yarn && yarn build
