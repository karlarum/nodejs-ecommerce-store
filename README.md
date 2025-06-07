# Overview

As part of building up my full-stack development skills, I created The Tech Store—an e-commerce web application built with Node.js and Express. This project demonstrates my ability to build dynamic, interactive web applications that handle real-world business requirements like product catalogs, shopping cart management, and secure checkout processes.

The site includes features such as: product listings, detailed product pages, shopping cart functionality, and a mock checkout process. The application uses server-side rendering with EJS templates to dynamically generate content based on user interactions and session data.

To start the application, ensure you have Node.js installed, then run `npm install` to install dependencies followed by `npm start` to launch the development server. Open your browser to `http://localhost:3000` to view the application homepage and begin exploring the product catalog.

My purpose for developing this software was to gain hands-on experience with modern web development frameworks, learn session management, implement form validation, and understand the architecture of e-commerce applications. This project helped me understand server-side JavaScript, template engines, and responsive web design principles.

[Software Demo Video](http://youtube.link.goes.here)

# Web Pages

**Home Page** - The home page displays a selection of featured electronics. Products are dynamically loaded from the server with ratings, prices, and feature highlights. Users can view the product catalog and navigate to detailed product views.

**Product Detail Page** - Individual product pages show product information including images, descriptions, key features, pricing, and quantity selection. The page dynamically loads related products in the same category.

**Shopping Cart Page** - The cart displays all selected items with quantity management, individual and total pricing calculations including tax and shipping. Users can update quantities, remove items, and see real-time total updates. The page dynamically calculates shipping costs (free over $50) and tax rates.

**Checkout Page** - A comprehensive checkout form with multiple sections for billing information, shipping address, and payment details. The page includes real-time form validation, auto-formatting for credit card numbers and phone numbers, and displays an order summary with final pricing calculations.

**Order Confirmation Page** - After successful order submission, users are redirected to a confirmation page showing order details, unique order ID, itemized purchases, and next steps. The page confirms the order has been processed and provides relevant follow-up information.

# Development Environment

I developed this application using Visual Studio Code. The project utilizes Git for version control and npm for package management.

The application is built with **Node.js** and **JavaScript (ES6+)** using the Express.js framework for server-side routing and middleware.

# Useful Websites

* [Express.js Official Documentation](https://expressjs.com/)
* [EJS Documentation](https://ejs.co/)
* [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [CSS-Tricks](https://css-tricks.com/)
* [Node.js Official Docs](https://nodejs.org/en/docs/)

# Future Work

* Fix the checkout page so that it has real payment processing
* Implement a database
* Add product inventory management
* Add actual product reviews
