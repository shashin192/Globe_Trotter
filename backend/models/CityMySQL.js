const { executeQuery } = require('../config/database');

class City {
  constructor(cityData) {
    this.id = cityData.id;
    this.name = cityData.name;
    this.country = cityData.country;
    this.region = cityData.region;
    this.latitude = cityData.latitude;
    this.longitude = cityData.longitude;
    this.description = cityData.description;
    this.cost_index = cityData.cost_index;
    this.popularity_score = cityData.popularity_score;
    this.timezone = cityData.timezone;
    this.currency = cityData.currency;
    this.languages = cityData.languages || [];
    this.tags = cityData.tags || [];
    this.created_at = cityData.created_at;
    this.updated_at = cityData.updated_at;
  }

  // Create a new city
  static async create(cityData) {
    try {
      const query = `
        INSERT INTO cities (name, country, region, latitude, longitude, description, 
                           cost_index, popularity_score, timezone, currency, languages, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const languagesJson = JSON.stringify(cityData.languages || []);
      const tagsJson = JSON.stringify(cityData.tags || []);
      
      const result = await executeQuery(query, [
        cityData.name,
        cityData.country,
        cityData.region,
        cityData.latitude,
        cityData.longitude,
        cityData.description,
        cityData.cost_index || 3,
        cityData.popularity_score || 0,
        cityData.timezone,
        cityData.currency,
        languagesJson,
        tagsJson
      ]);

      return await City.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Find city by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM cities WHERE id = ?';
      const result = await executeQuery(query, [id]);
      
      if (result.length === 0) return null;
      
      const cityData = result[0];
      cityData.languages = JSON.parse(cityData.languages || '[]');
      cityData.tags = JSON.parse(cityData.tags || '[]');
      
      return new City(cityData);
    } catch (error) {
      throw error;
    }
  }

  // Find all cities with optional filters
  static async find(filters = {}) {
    try {
      let query = 'SELECT * FROM cities';
      const conditions = [];
      const values = [];

      if (filters.country) {
        conditions.push('country = ?');
        values.push(filters.country);
      }

      if (filters.region) {
        conditions.push('region = ?');
        values.push(filters.region);
      }

      if (filters.search) {
        conditions.push('(name LIKE ? OR country LIKE ? OR region LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        values.push(searchTerm, searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY popularity_score DESC';

      if (filters.limit) {
        query += ' LIMIT ?';
        values.push(parseInt(filters.limit));
      }

      const result = await executeQuery(query, values);
      
      return result.map(cityData => {
        cityData.languages = JSON.parse(cityData.languages || '[]');
        cityData.tags = JSON.parse(cityData.tags || '[]');
        return new City(cityData);
      });
    } catch (error) {
      throw error;
    }
  }

  // Search cities by text
  static async search(searchTerm, limit = 20) {
    try {
      const query = `
        SELECT * FROM cities 
        WHERE MATCH(name, country) AGAINST(? IN NATURAL LANGUAGE MODE)
           OR name LIKE ? OR country LIKE ?
        ORDER BY popularity_score DESC
        LIMIT ?
      `;
      
      const likeTerm = `%${searchTerm}%`;
      const result = await executeQuery(query, [searchTerm, likeTerm, likeTerm, limit]);
      
      return result.map(cityData => {
        cityData.languages = JSON.parse(cityData.languages || '[]');
        cityData.tags = JSON.parse(cityData.tags || '[]');
        return new City(cityData);
      });
    } catch (error) {
      throw error;
    }
  }

  // Find cities near coordinates
  static async findNearby(latitude, longitude, radiusKm = 100, limit = 10) {
    try {
      const query = `
        SELECT *, 
               (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
               cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
               sin(radians(latitude)))) AS distance
        FROM cities
        HAVING distance < ?
        ORDER BY distance
        LIMIT ?
      `;
      
      const result = await executeQuery(query, [latitude, longitude, latitude, radiusKm, limit]);
      
      return result.map(cityData => {
        cityData.languages = JSON.parse(cityData.languages || '[]');
        cityData.tags = JSON.parse(cityData.tags || '[]');
        return new City(cityData);
      });
    } catch (error) {
      throw error;
    }
  }

  // Update city
  static async findByIdAndUpdate(id, updateData) {
    try {
      const setClause = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (key === 'languages' || key === 'tags') {
          setClause.push(`${key} = ?`);
          values.push(JSON.stringify(updateData[key]));
        } else if (key !== 'id' && key !== 'created_at') {
          setClause.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (setClause.length === 0) return null;

      values.push(id);
      const query = `UPDATE cities SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      await executeQuery(query, values);
      return await City.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete city
  static async findByIdAndDelete(id) {
    try {
      const query = 'DELETE FROM cities WHERE id = ?';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get city images
  async getImages() {
    try {
      const query = 'SELECT * FROM city_images WHERE city_id = ? ORDER BY is_primary DESC, created_at ASC';
      const result = await executeQuery(query, [this.id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Add image to city
  async addImage(imageData) {
    try {
      const query = `
        INSERT INTO city_images (city_id, url, caption, is_primary)
        VALUES (?, ?, ?, ?)
      `;
      
      const result = await executeQuery(query, [
        this.id,
        imageData.url,
        imageData.caption || null,
        imageData.is_primary || false
      ]);

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get city costs
  async getCosts() {
    try {
      const query = 'SELECT * FROM city_costs WHERE city_id = ?';
      const result = await executeQuery(query, [this.id]);
      
      // Group costs by category and type
      const costs = {};
      result.forEach(cost => {
        if (!costs[cost.category]) {
          costs[cost.category] = {};
        }
        costs[cost.category][cost.cost_type] = cost.amount;
      });
      
      return costs;
    } catch (error) {
      throw error;
    }
  }

  // Get best times to visit
  async getBestTimes() {
    try {
      const query = 'SELECT * FROM city_best_times WHERE city_id = ? ORDER BY FIELD(month, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")';
      const result = await executeQuery(query, [this.id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get city activities
  async getActivities(filters = {}) {
    try {
      let query = 'SELECT * FROM activities WHERE city_id = ? AND is_active = TRUE';
      const values = [this.id];

      if (filters.category) {
        query += ' AND category = ?';
        values.push(filters.category);
      }

      if (filters.price_category) {
        query += ' AND price_category = ?';
        values.push(filters.price_category);
      }

      query += ' ORDER BY rating_average DESC, rating_count DESC';

      if (filters.limit) {
        query += ' LIMIT ?';
        values.push(parseInt(filters.limit));
      }

      const result = await executeQuery(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = City;