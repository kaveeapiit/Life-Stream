import pool from "../config/db.js";

const BloodStockModel = {
  // Get all blood stock for a hospital
  getHospitalBloodStock: async (hospitalId) => {
    try {
      const result = await pool.query(
        `SELECT 
           blood_type,
           stock_count,
           last_updated,
           updated_by
         FROM blood_stock 
         WHERE hospital_id = $1 
         ORDER BY 
           CASE blood_type
             WHEN 'A+' THEN 1
             WHEN 'A-' THEN 2
             WHEN 'B+' THEN 3
             WHEN 'B-' THEN 4
             WHEN 'AB+' THEN 5
             WHEN 'AB-' THEN 6
             WHEN 'O+' THEN 7
             WHEN 'O-' THEN 8
           END`,
        [hospitalId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching hospital blood stock:", error);
      throw error;
    }
  },

  // Initialize stock for a hospital (creates all blood types with 0 stock)
  initializeHospitalStock: async (hospitalId, username = 'system') => {
    try {
      const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      
      const values = bloodTypes.map(bloodType => 
        `(${hospitalId}, '${bloodType}', 0, '${username}')`
      ).join(', ');
      
      const query = `
        INSERT INTO blood_stock (hospital_id, blood_type, stock_count, updated_by)
        VALUES ${values}
        ON CONFLICT (hospital_id, blood_type) DO NOTHING
        RETURNING *
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error initializing hospital blood stock:", error);
      throw error;
    }
  },

  // Update stock count for a specific blood type
  updateBloodStock: async (hospitalId, bloodType, stockCount, username) => {
    try {
      const result = await pool.query(
        `INSERT INTO blood_stock (hospital_id, blood_type, stock_count, updated_by)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (hospital_id, blood_type)
         DO UPDATE SET 
           stock_count = EXCLUDED.stock_count,
           updated_by = EXCLUDED.updated_by,
           last_updated = CURRENT_TIMESTAMP
         RETURNING *`,
        [hospitalId, bloodType, stockCount, username]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating blood stock:", error);
      throw error;
    }
  },

  // Update multiple blood types at once
  updateMultipleBloodStock: async (hospitalId, stockUpdates, username) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const updatedStocks = [];
      
      for (const { bloodType, stockCount } of stockUpdates) {
        const result = await client.query(
          `INSERT INTO blood_stock (hospital_id, blood_type, stock_count, updated_by)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (hospital_id, blood_type)
           DO UPDATE SET 
             stock_count = EXCLUDED.stock_count,
             updated_by = EXCLUDED.updated_by,
             last_updated = CURRENT_TIMESTAMP
           RETURNING *`,
          [hospitalId, bloodType, stockCount, username]
        );
        updatedStocks.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      return updatedStocks;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error updating multiple blood stocks:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Get stock summary for dashboard
  getStockSummary: async (hospitalId) => {
    try {
      const result = await pool.query(
        `SELECT 
           SUM(stock_count) as total_units,
           COUNT(CASE WHEN stock_count = 0 THEN 1 END) as out_of_stock_types,
           COUNT(CASE WHEN stock_count > 0 AND stock_count < 10 THEN 1 END) as low_stock_types,
           COUNT(CASE WHEN stock_count >= 10 THEN 1 END) as adequate_stock_types,
           MAX(last_updated) as last_updated
         FROM blood_stock 
         WHERE hospital_id = $1`,
        [hospitalId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching stock summary:", error);
      throw error;
    }
  },

  // Get low stock alerts (stock count < 10)
  getLowStockAlerts: async (hospitalId, threshold = 10) => {
    try {
      const result = await pool.query(
        `SELECT 
           blood_type,
           stock_count,
           last_updated
         FROM blood_stock 
         WHERE hospital_id = $1 AND stock_count < $2 AND stock_count >= 0
         ORDER BY stock_count ASC`,
        [hospitalId, threshold]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
      throw error;
    }
  },

  // Get stock for a specific blood type
  getBloodTypeStock: async (hospitalId, bloodType) => {
    try {
      const result = await pool.query(
        `SELECT * FROM blood_stock 
         WHERE hospital_id = $1 AND blood_type = $2`,
        [hospitalId, bloodType]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching blood type stock:", error);
      throw error;
    }
  }
};

export default BloodStockModel;