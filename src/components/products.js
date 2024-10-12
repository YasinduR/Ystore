import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './Product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/ystore/items'); // Update the URL as needed
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div className="product" key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Stock: {product.stock}</p>
          <p>Price: ${product.price}</p>
          {product.special_price && <p>Special Price: ${product.special_price}</p>}
        </div>
      ))}
    </div>
  );
};

export default Products;