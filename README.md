# Numerical Methods Solver Application

## Overview
Nexus Solver is a premium, interactive web application designed for engineering students, mathematics learners, and researchers. It allows users to quickly solve numerical problems using three standard algorithms.

## Features Supported
1. **Gauss Elimination Method**: Solves a system of linear equations and displays step-by-step intermediate matrices.
2. **Newton's Forward Interpolation Method**: Predicts missing data values relying on forward difference tables, which are explicitly generated and shown to the user.
3. **Runge-Kutta 4th Order (RK4)**: Approximates solutions to ordinary differential equations. Mathematical expressions are safely interpolated via `math.js`.

## Tech Stack
- HTML5
- CSS3 (Vanilla, premium glassmorphism styling, native styling, responsive design)
- JavaScript (ES6 Modules)
- [Math.js](https://mathjs.org/) (for parsing and evaluating differential equation expressions)

## Installation & Running Locally
Since this is an entirely client-side application (HTML/JS/CSS), there's no complex build process or backend to configure.

To run the application:
1. Ensure all files (`index.html`, `css/style.css`, `js/*`) are present in this directory.
2. If you have Python installed, you can simply run:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000` in your web browser.
3. Alternatively, you can use any static server, such as the `Live Server` VSCode extension, or Node's `http-server` via `npx http-server .`

*Note: Accessing index.html directly from the file system (via `file://`) might cause CORS issues because of ES6 module imports (`<script type="module">`). It's highly recommended to use a local or remote web server.*

## Web Deployment Support
This project is perfectly suited for static hosting services such as:
- GitHub Pages
- Vercel
- Netlify

Simply link your repository and deploy the root directory to go live.

## Testing Sample Cases
The application includes a **Load Sample** button for every method so you can immediately see how data formatting should look.

**1. Gauss Elimination**:
Sample:
```
  2x +  y -  z =  8
 -3x -  y + 2z = -11
 -2x +  y + 2z = -3
```
Result: x = 2, y = 3, z = -1

**2. Newton Forward Interpolation**:
Sample: `x: [0, 1, 2, 3], y: [1, 2, 1, 10]`, Target: 1.5.

**3. RK4**:
Sample: `dy/dx = x + y`, `x0=0`, `y0=1`, `h=0.1`, Target `x=0.2`.
