import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Star, Users, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import shops from '../utils/shops';
import { showToast } from '../utils/toast';

const ShopsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterTrusted, setFilterTrusted] = useState(false);

  // Filter and sort shops
  const filteredShops = useMemo(() => {
    let result = shops.filter(shop => {
      const matchesSearch = 
        shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTrusted = !filterTrusted || shop.trusted_seller;
      
      return matchesSearch && matchesTrusted;
    });

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'distance') {
      result.sort((a, b) => {
        const distA = parseInt(a.distance);
        const distB = parseInt(b.distance);
        return distA - distB;
      });
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [searchTerm, sortBy, filterTrusted]);

  const handleVisitShop = (shopName) => {
    showToast.success(`Visiting ${shopName}...`);
    // Navigate to shop or trigger shop view
  };

  return (
    <div className="shops-page">
      <div className="shops-container">
        {/* HEADER */}
        <div className="shops-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="shops-header-content">
            <h1>Verified Shops</h1>
            <p>Browse and discover trusted sellers near you</p>
          </div>
        </div>

        {/* FILTERS AND SEARCH */}
        <div className="shops-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search shops by name, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shops-search"
            />
          </div>

          <div className="filter-section">
            <div className="sort-control">
              <label>Sort By:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="rating">Highest Rating</option>
                <option value="distance">Nearest First</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            <label className="trusted-filter">
              <input
                type="checkbox"
                checked={filterTrusted}
                onChange={(e) => setFilterTrusted(e.target.checked)}
              />
              <span>Trusted Sellers Only</span>
            </label>
          </div>
        </div>

        {/* SHOPS GRID */}
        {filteredShops.length === 0 ? (
          <div className="empty-shops">
            <Users size={64} />
            <h2>No Shops Found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="shops-grid">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="shop-card">
                {/* SHOP IMAGE */}
                <div className="shop-image-container">
                  <img 
                    src={shop.shop_image} 
                    alt={shop.shop_name}
                    className="shop-image"
                  />
                  
                  {/* BADGES */}
                  <div className="shop-badges">
                    {shop.verified && (
                      <span className="badge verified" title="Verified Shop">
                        <CheckCircle size={14} />
                        Verified
                      </span>
                    )}
                    {shop.trusted_seller && (
                      <span className="badge trusted" title="Trusted Seller">
                        ⭐ Trusted
                      </span>
                    )}
                    {shop.fast_delivery && (
                      <span className="badge fast-delivery" title="Fast Delivery">
                        <Zap size={14} />
                        Fast
                      </span>
                    )}
                  </div>

                  {/* DISTANCE */}
                  <div className="shop-distance">
                    <MapPin size={14} />
                    {shop.distance}
                  </div>
                </div>

                {/* SHOP INFO */}
                <div className="shop-info">
                  <h3 className="shop-name">{shop.shop_name}</h3>
                  
                  <p className="shop-location">
                    <MapPin size={14} />
                    {shop.location}
                  </p>

                  <p className="shop-description">{shop.description}</p>

                  {/* CATEGORIES */}
                  <div className="shop-categories">
                    {shop.categories.map((category, idx) => (
                      <span key={idx} className="category-tag">
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* RATING & REVIEWS */}
                  <div className="shop-stats">
                    <div className="rating-section">
                      <span className="rating">
                        <Star size={16} fill="#ffc107" color="#ffc107" />
                        {shop.rating}
                      </span>
                      <span className="reviews">({shop.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* VISIT BUTTON */}
                  <button 
                    className="visit-shop-btn"
                    onClick={() => handleVisitShop(shop.shop_name)}
                  >
                    Visit Shop
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESULTS COUNT */}
        <div className="shops-footer">
          <p>Showing {filteredShops.length} of {shops.length} shops</p>
        </div>
      </div>
    </div>
  );
};

export default ShopsPage;
