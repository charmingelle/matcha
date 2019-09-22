#!/bin/bash
psql -l matcha &>/dev/null && echo 'DATABASE ALREADY EXISTS' || psql -c 'CREATE DATABASE matcha' grevenko
