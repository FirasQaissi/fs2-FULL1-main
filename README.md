# Smart Lock Store

A full-stack application for displaying smart lock products with a modern, responsive design.

## Features

- **Public Product Display**: View all products without authentication
- **Responsive Grid Layout**: Products displayed in a beautiful grid layout
- **Product Details**: Each product shows name, description, version, features, and price
- **Modern UI**: Built with Material-UI components for a professional look
- **Image Support**: Products include high-quality images

## Product Schema

Each product includes:

- `name`: Product name
- `descriptions`: Detailed product description
- `version`: Product version
- `features`: Array of product features
- `price`: Product price
- `image`: Product image path

## Setup Instructions

### Backend Setup

1. Navigate to the `back` directory
2. Install dependencies: `npm install`
3. Set up your MongoDB connection string in `.env`
4. Start the server: `npm start`
5. (Optional) Seed the database with sample products: `node seedProducts.js`

### Frontend Setup

1. Navigate to the `front` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## API Endpoints

### Public Endpoints (No Authentication Required)

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product by ID

### Protected Endpoints (Authentication Required)

- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Sample Products

The application includes 7 sample smart lock products with images:

1. Allegion Schlage Omnia Smart Lock
2. Ultra-Secure Smart Lock Pro
3. Modern Smart Lock Classic
4. Premium Smart Lock Elite
5. Compact Smart Lock Mini
6. Smart Lock Web Series
7. Designer Smart Lock Collection

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend

- React
- TypeScript
- Material-UI
- React Router

## Project Structure

```
├── back/
│   ├── controllers/
│   │   └── productController.js
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── products.js
│   ├── seedProducts.js
│   └── server.js
├── front/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.tsx
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── services/
│   │   │   └── productService.ts
│   │   ├── types/
│   │   │   └── product.ts
│   │   └── images/
│   │       └── [product images]
│   └── package.json
└── README.md
```
