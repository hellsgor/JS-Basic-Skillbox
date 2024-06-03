# Diploma Project for "JavaScript. Basic Level" Course

This project is a small CRM system with the following features:

- Viewing the client list in a table format;
- Adding new clients;
- Editing existing client information.

The backend part was already developed.

Design in Figma - [https://www.figma.com/file/rcta5K2ySOhnskjG1D82jL/CRM](https://www.figma.com/file/rcta5K2ySOhnskjG1D82jL/CRM)

## Functionality

### Implemented from the main requirements:

- Page load indicator (preloader);
- Client table;
- Table sorting (the API provides unsorted data). By default, sorting should be in ascending order by ID;
- Displaying contacts and contact tooltips;
- Modal windows for adding, editing, and deleting clients, triggered by corresponding buttons;
- Modal windows for creating, editing, and confirming client deletion;
- Switching between modal windows (from the editing window to the deletion window and back);
- Validation of the number of client contacts;
- Deleting client contacts;
- Form data submission;
- Handling form submission responses and displaying errors.

### Implemented from additional requirements:

- Form field validation before submission;
- Link to the client editing modal window (hash part of the page URL);
- Data loading indicator for the client table (preloader);
- Data loading indicator for modal windows and form submission (preloader).

## Stack

### Technologies:

- Vite;
- HTML / Handlebars;
- SCSS;
- JavaScript.

### Libraries:

- prettier;
- eslint;
- autoprefixer;
- normalize.css;
- axios;
- jsdoc.

## Requirements

- JS code must follow a specific code style.
- The layout must be responsive.

## Running the Project

1. Ensure you have Node.js installed (version used during development: 20.11.0).
2. Install the dependencies by running: `npm install` from the `/frontend` directory.
3. Start the data server by running: `node index.js` from the `/backend` directory.
4. Run the project in development mode with: `npm run dev` from the `/frontend` directory. This will start a local development server. Open your browser and go to http://localhost:5173/ to see the result.
5. To build the project for production, run: `npm run build` from the `/frontend` directory. The built files will be located in the `/frontend/dist` directory.
6. To preview the built project, use: `npm run preview` from the `/frontend` directory. This will start a local server for previewing the built project.
