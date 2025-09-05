// Hospital API service with JWT token support

class HospitalAPI {
  constructor() {
    // Automatically detect environment
    this.baseURL = import.meta.env.PROD
      ? "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net"
      : "http://localhost:5050";
    this.token = localStorage.getItem("hospital_token");
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem("hospital_token", token);
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem("hospital_token");
  }

  // Get authorization headers
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Make authenticated request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: "include", // Still include for session fallback
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 - token expired or invalid
      if (response.status === 401) {
        this.clearToken();
        // Redirect to login or show login modal
        window.location.href = "/hospital/login";
        return null;
      }

      return response;
    } catch (error) {
      console.error("Hospital API request failed:", error);
      throw error;
    }
  }

  // Login method
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/api/hospital/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      this.setToken(data.token);
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Login failed" };
    }
  }

  // Dashboard stats
  async getDashboardStats() {
    const response = await this.request("/api/hospital/dashboard/stats");
    return response ? await response.json() : null;
  }

  // Inventory summary
  async getInventorySummary() {
    const response = await this.request("/api/hospital/inventory/summary");
    return response ? await response.json() : null;
  }

  // Blood request stats
  async getBloodRequestStats() {
    const response = await this.request("/api/hospital/blood-requests/stats");
    return response ? await response.json() : null;
  }

  // All donations
  async getAllDonations() {
    const response = await this.request("/api/hospital/donations/all");
    return response ? await response.json() : null;
  }

  // Donation history
  async getDonationHistory() {
    const response = await this.request("/api/hospital/donations/history");
    return response ? await response.json() : null;
  }

  // Available donors
  async getAvailableDonors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/donors/available${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token;
  }

  // Get current hospital info from token
  getHospitalInfo() {
    if (!this.token) return null;

    try {
      // Decode JWT token (simple base64 decode of payload)
      const payload = this.token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.hospitalId,
        username: decoded.username,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      this.clearToken();
      return null;
    }
  }

  // Update donation status
  async updateDonationStatus(id, status) {
    const response = await this.request(`/api/donation/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return response ? await response.json() : null;
  }

  // Donor matching methods
  async getMatchingDonors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/donors/matching${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  async getBloodRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/blood-requests${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  async getMatchingSummary() {
    const response = await this.request("/api/hospital/matching/summary");
    return response ? await response.json() : null;
  }

  async getMatchingOverview() {
    const response = await this.request("/api/hospital/matching/overview");
    return response ? await response.json() : null;
  }

  async getCompatibleDonors(requestId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/blood-requests/${requestId}/compatible-donors${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  // Location-based matching methods
  async getLocationCompatibleDonors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/donors/location/compatible${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  async getLocationStats() {
    const response = await this.request(
      "/api/hospital/matching/location/stats"
    );
    return response ? await response.json() : null;
  }

  // Hospital-to-hospital request methods
  async getAvailableRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/requests/available${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  async getMyRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/requests/mine${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  async createRequest(requestData) {
    const response = await this.request("/api/hospital/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
    return response ? await response.json() : null;
  }

  async respondToRequest(requestId, action, responseData = {}) {
    const response = await this.request(
      `/api/hospital/requests/${requestId}/respond`,
      {
        method: "POST",
        body: JSON.stringify({ action, ...responseData }),
      }
    );
    return response ? await response.json() : null;
  }

  // Blood requests management
  async getAllBloodRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/hospital/blood-requests/all${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await this.request(endpoint);
    return response ? await response.json() : null;
  }

  async updateBloodRequestStatus(requestId, status) {
    const response = await this.request(
      `/api/hospital/blood-requests/${requestId}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
    return response ? await response.json() : null;
  }

  async getBloodRequestDetails(requestId) {
    const response = await this.request(
      `/api/hospital/blood-requests/${requestId}`
    );
    return response ? await response.json() : null;
  }

  // Logout method
  async logout() {
    try {
      // Call backend logout endpoint to clear session
      await fetch(`${this.baseURL}/api/hospital/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Always clear local token
      this.clearToken();
    }
  }
}

// Export singleton instance
export default new HospitalAPI();
