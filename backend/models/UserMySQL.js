const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.profile_photo = userData.profile_photo || '';
    this.language = userData.language || 'en';
    this.currency = userData.currency || 'USD';
    this.budget_range = userData.budget_range || 'mid-range';
    this.travel_style = userData.travel_style || [];
    this.is_active = userData.is_active !== undefined ? userData.is_active : true;
    this.last_login = userData.last_login;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const query = `
        INSERT INTO users (name, email, password, profile_photo, language, currency, budget_range, travel_style)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const travelStyleJson = JSON.stringify(userData.travel_style || []);
      
      const result = await executeQuery(query, [
        userData.name,
        userData.email,
        hashedPassword,
        userData.profile_photo || '',
        userData.language || 'en',
        userData.currency || 'USD',
        userData.budget_range || 'mid-range',
        travelStyleJson
      ]);

      return await User.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
      const result = await executeQuery(query, [id]);
      
      if (result.length === 0) return null;
      
      const userData = result[0];
      userData.travel_style = JSON.parse(userData.travel_style || '[]');
      
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
      const result = await executeQuery(query, [email]);
      
      if (result.length === 0) return null;
      
      const userData = result[0];
      userData.travel_style = JSON.parse(userData.travel_style || '[]');
      
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async findByIdAndUpdate(id, updateData) {
    try {
      const setClause = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (key === 'travel_style') {
          setClause.push(`${key} = ?`);
          values.push(JSON.stringify(updateData[key]));
        } else if (key !== 'id' && key !== 'created_at') {
          setClause.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (setClause.length === 0) return null;

      values.push(id);
      const query = `UPDATE users SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      await executeQuery(query, values);
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete user (soft delete)
  static async findByIdAndDelete(id) {
    try {
      const query = 'UPDATE users SET is_active = FALSE WHERE id = ?';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Update last login
  async updateLastLogin() {
    try {
      const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
      await executeQuery(query, [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get user's saved destinations
  async getSavedDestinations() {
    try {
      const query = `
        SELECT c.*, usd.saved_at 
        FROM user_saved_destinations usd
        JOIN cities c ON usd.city_id = c.id
        WHERE usd.user_id = ?
        ORDER BY usd.saved_at DESC
      `;
      const result = await executeQuery(query, [this.id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Save destination
  async saveDestination(cityId) {
    try {
      const query = `
        INSERT INTO user_saved_destinations (user_id, city_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP
      `;
      await executeQuery(query, [this.id, cityId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Remove saved destination
  async removeSavedDestination(cityId) {
    try {
      const query = 'DELETE FROM user_saved_destinations WHERE user_id = ? AND city_id = ?';
      await executeQuery(query, [this.id, cityId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }
}

module.exports = User;