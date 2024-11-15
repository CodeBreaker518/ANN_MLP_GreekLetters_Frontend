# ANN MLP Greek Letters Frontend

This repository contains the frontend for a web application that allows testing an artificial neural network (ANN) model of the multilayer perceptron (MLP) type, designed to recognize lowercase Greek letters handwritten. The API implemented with FastAPI allows using the already trained model, facilitating the processing of images of letters drawn by users.

## Table of Contents

- [ANN MLP Greek Letters Frontend](#ann-mlp-greek-letters-frontend)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)

## Description

The project consists of a modern interface for interacting with a neural network model that recognizes lowercase Greek letters handwritten. Users can draw a letter in the browser, and the neural network will process the drawing, returning the letter that best matches the pattern trained in the model.

This frontend communicates with an API developed in FastAPI, which uses a pre-trained model to perform the recognition, find this project here: [Backend ia1114_RNA_GreekLetters](https://github.com/CodeBreaker518/ia1114_RNA_GreekLetters)

## Features

- Intuitive UI for drawing Greek letters.
- Connection with an API that processes the drawings and returns recognition results.
- Fast response and real-time feedback.
- Display of accuracy and alternative predictions.

## Installation

To install the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ANN-MLP-GreekLetters-Frontend.git
   ```

2. Install necesary dependencies

   ```bash
    cd ./ANN-MLP-GreekLetters-Frontend
    bun install

   ```

3. Run it
   ```bash
    bun run dev
   ```
