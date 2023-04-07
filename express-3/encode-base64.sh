#!/bin/bash

echo -n "Masukkan username: " 
read username
echo -n "Masukkan password: " 
read password

# Encode input string to base64
user_name=$(echo -n "$username" | base64)
pass_word=$(echo -n "$password" | base64)

echo "\n"
echo "Hasil encoding username ke base64: $user_name"
echo "Hasil encoding password ke base64: $pass_word"
