# 🎬 Bollywood Movie Explorer

A modern and interactive **Bollywood Movie Explorer** developed as a JavaScript Lab project.

The application uses the **OMDb API** to retrieve movie information and allows users to search for Bollywood movies based on **movie name, release year, and IMDb rating**.

The project demonstrates practical implementation of **HTML, CSS, JavaScript, REST API integration, Fetch API, dynamic DOM manipulation, search filtering, and responsive UI design**.

---

## 📌 Project Overview

The **Bollywood Movie Explorer** is a web-based application that allows users to discover Bollywood movies and view important movie information retrieved dynamically from the OMDb API.

Users can:

- 🔎 Search for Bollywood movies
- 📅 Search movies by release year
- ⭐ Filter movies using minimum IMDb rating
- 🎬 View movie posters
- ⭐ View IMDb ratings
- 📖 View movie plots
- 🎭 View genres
- 🎥 View directors
- 📆 View release years
- 🔗 Access detailed movie information
- ⚡ Retrieve data dynamically using JavaScript Fetch API

---

## 🎯 Problem Statement

> To call a Bollywood Movie API and retrieve Bollywood movie information based on IMDb ratings. The application should also support searching/filtering movies year-wise wherever possible.

---

## 💡 Solution

This project provides a simple and user-friendly web interface where users can search for Bollywood movies.

The application communicates with the **OMDb API** using JavaScript's `Fetch API`. The received JSON response is processed and displayed dynamically on the webpage.

The application provides filtering options such as:

- Movie Name
- Release Year
- Minimum IMDb Rating

The retrieved movie information is presented using attractive movie cards.

---

## 🚀 Features

### 🔎 Movie Search

Users can enter a movie name and search for matching movies.

### 📅 Year-wise Search

Users can enter a release year to narrow down the search results.

### ⭐ IMDb Rating Filter

Users can select a minimum IMDb rating and display movies satisfying the selected rating criteria.

### 🎬 Movie Cards

Each movie is displayed in a structured card containing information such as:

- Movie Poster
- Movie Title
- Release Year
- IMDb Rating
- Genre
- Director
- Plot

### 🎨 Responsive User Interface

The application uses a modern responsive layout that works across different screen sizes.

### ⚡ Dynamic API Data

Movie information is not hard-coded. It is retrieved dynamically from the OMDb API.

### 🔄 Reset Functionality

Users can reset the search fields and return to the default state.

### 💬 Status Messages

The application displays appropriate messages for:

- Successful searches
- No results
- API errors
- Invalid API responses
- Internet/API connection problems

---

# 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Webpage structure |
| CSS3 | Styling and responsive UI |
| JavaScript | Application logic |
| Fetch API | API communication |
| OMDb API | Movie information |
| IMDb | Movie ratings/data source |
| VS Code | Development environment |
| GitHub | Source code management |

---

# 🔌 API Used

## OMDb API

This project uses the **Open Movie Database (OMDb) API** to retrieve movie information.

The API provides information such as:

- Movie title
- Release year
- IMDb rating
- IMDb ID
- Poster
- Genre
- Director
- Actors
- Plot
- Runtime
- Language
- Awards
- Box office information

The application sends requests to the OMDb API and processes the returned JSON data using JavaScript.

---

# 🔑 API Key

An OMDb API key is required to retrieve movie information.

The API request follows the general format:

```text
https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=MOVIE_NAME
