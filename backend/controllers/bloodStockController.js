import BloodStockModel from "../models/BloodStockModel.js";

// Get hospital blood stock
export const getHospitalBloodStock = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    let bloodStock = await BloodStockModel.getHospitalBloodStock(hospital.id);
    
    // If no stock exists, initialize with default values
    if (bloodStock.length === 0) {
      await BloodStockModel.initializeHospitalStock(hospital.id, hospital.username);
      bloodStock = await BloodStockModel.getHospitalBloodStock(hospital.id);
    }

    res.status(200).json(bloodStock);
  } catch (err) {
    console.error("Error fetching hospital blood stock:", err);
    res.status(500).json({ error: "Failed to fetch blood stock" });
  }
};

// Update blood stock for a specific blood type
export const updateBloodStock = async (req, res) => {
  const { hospital } = req.session;
  const { bloodType } = req.params;
  const { stockCount } = req.body;

  if (!hospital || !hospital.id || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized: Hospital login required" });
  }

  // Validate blood type
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validBloodTypes.includes(bloodType)) {
    return res.status(400).json({ error: "Invalid blood type" });
  }

  // Validate stock count
  if (typeof stockCount !== 'number' || stockCount < 0 || stockCount > 9999) {
    return res.status(400).json({ error: "Stock count must be a number between 0 and 9999" });
  }

  try {
    const updatedStock = await BloodStockModel.updateBloodStock(
      hospital.id,
      bloodType,
      stockCount,
      hospital.username
    );

    res.status(200).json({
      message: `Stock updated successfully for ${bloodType}`,
      stock: updatedStock
    });
  } catch (err) {
    console.error("Error updating blood stock:", err);
    res.status(500).json({ error: "Failed to update blood stock" });
  }
};

// Update multiple blood stock entries
export const updateMultipleBloodStock = async (req, res) => {
  const { hospital } = req.session;
  const { stockUpdates } = req.body;

  if (!hospital || !hospital.id || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized: Hospital login required" });
  }

  // Validate input
  if (!Array.isArray(stockUpdates) || stockUpdates.length === 0) {
    return res.status(400).json({ error: "Stock updates must be a non-empty array" });
  }

  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Validate each update
  for (const update of stockUpdates) {
    if (!update.bloodType || !validBloodTypes.includes(update.bloodType)) {
      return res.status(400).json({ error: `Invalid blood type: ${update.bloodType}` });
    }
    if (typeof update.stockCount !== 'number' || update.stockCount < 0 || update.stockCount > 9999) {
      return res.status(400).json({ 
        error: `Invalid stock count for ${update.bloodType}: must be between 0 and 9999` 
      });
    }
  }

  try {
    const updatedStocks = await BloodStockModel.updateMultipleBloodStock(
      hospital.id,
      stockUpdates,
      hospital.username
    );

    res.status(200).json({
      message: `Successfully updated ${updatedStocks.length} blood stock entries`,
      stocks: updatedStocks
    });
  } catch (err) {
    console.error("Error updating multiple blood stocks:", err);
    res.status(500).json({ error: "Failed to update blood stocks" });
  }
};

// Get blood stock summary for dashboard
export const getBloodStockSummary = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const summary = await BloodStockModel.getStockSummary(hospital.id);
    res.status(200).json(summary);
  } catch (err) {
    console.error("Error fetching blood stock summary:", err);
    res.status(500).json({ error: "Failed to fetch stock summary" });
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res) => {
  const { hospital } = req.session;
  const { threshold = 10 } = req.query;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const alerts = await BloodStockModel.getLowStockAlerts(hospital.id, parseInt(threshold));
    res.status(200).json(alerts);
  } catch (err) {
    console.error("Error fetching low stock alerts:", err);
    res.status(500).json({ error: "Failed to fetch stock alerts" });
  }
};

// Get stock for specific blood type
export const getBloodTypeStock = async (req, res) => {
  const { hospital } = req.session;
  const { bloodType } = req.params;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized: Hospital login required" });
  }

  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validBloodTypes.includes(bloodType)) {
    return res.status(400).json({ error: "Invalid blood type" });
  }

  try {
    const stock = await BloodStockModel.getBloodTypeStock(hospital.id, bloodType);
    
    if (!stock) {
      // Initialize if doesn't exist
      await BloodStockModel.updateBloodStock(hospital.id, bloodType, 0, hospital.username);
      const newStock = await BloodStockModel.getBloodTypeStock(hospital.id, bloodType);
      return res.status(200).json(newStock);
    }

    res.status(200).json(stock);
  } catch (err) {
    console.error("Error fetching blood type stock:", err);
    res.status(500).json({ error: "Failed to fetch blood type stock" });
  }
};