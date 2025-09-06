// Admin API service with JWT token support

class AdminAPI {
  constructor() {
    // Automatically detect environment
    this.baseURL = import.meta.env.PROD
      ? "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net"
      : "http://localhost:5050";
    this.token = localStorage.getItem("admin_token");
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem("admin_token", token);
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem("admin_token");
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
        window.location.href = "/admin/login";
        return null;
      }

      return response;
    } catch (error) {
      console.error("Admin API request failed:", error);
      throw error;
    }
  }

  // Helper method to safely parse JSON responses
  async parseResponse(response) {
    if (!response) return null;

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        return await response.json();
      } catch (error) {
        console.warn("Failed to parse JSON response:", error);
        return null;
      }
    }

    // For non-JSON responses (like empty responses from DELETE), return success indicator
    return { success: true };
  }

  // Login method
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/api/admin/login`, {
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
      return { success: false, error: data.message || "Login failed" };
    }
  }

  // User management
  async getUsers() {
    const response = await this.request("/api/admin/users");
    return response ? await response.json() : null;
  }

  async getUser(id) {
    const response = await this.request(`/api/admin/users/${id}`);
    return response ? await response.json() : null;
  }

  async createUser(userData) {
    const response = await this.request("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response ? await response.json() : null;
  }

  async updateUser(id, userData) {
    const response = await this.request(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    return this.parseResponse(response);
  }

  async deleteUser(id) {
    const response = await this.request(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
    return this.parseResponse(response);
  }

  // Blood requests management
  async getAllBloodRequests() {
    const response = await this.request("/api/admin/blood-requests/all");
    return response ? await response.json() : null;
  }

  async getBloodRequestHistory() {
    const response = await this.request("/api/admin/blood-requests/history");
    return response ? await response.json() : null;
  }

  async updateBloodRequestApproval(requestId, approval) {
    const response = await this.request(
      `/api/admin/blood-requests/${requestId}/approval`,
      {
        method: "PUT",
        body: JSON.stringify({ approval }),
      }
    );
    return response ? await response.json() : null;
  }

  // Donations management
  async getAllDonations() {
    const response = await this.request("/api/admin/donations/all");
    return response ? await response.json() : null;
  }

  async getDonationHistory() {
    const response = await this.request("/api/admin/donations/history");
    return response ? await response.json() : null;
  }

  async updateDonationStatus(donationId, status) {
    const response = await this.request(
      `/api/admin/donations/${donationId}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
    return response ? await response.json() : null;
  }

  // Hospital management
  async getHospitals() {
    const response = await this.request("/api/admin/hospitals");
    return response ? await response.json() : null;
  }

  async getHospital(id) {
    const response = await this.request(`/api/admin/hospitals/${id}`);
    return response ? await response.json() : null;
  }

  async createHospital(hospitalData) {
    const response = await this.request("/api/admin/hospitals", {
      method: "POST",
      body: JSON.stringify(hospitalData),
    });
    return response ? await response.json() : null;
  }

  async updateHospital(id, hospitalData) {
    const response = await this.request(`/api/admin/hospitals/${id}`, {
      method: "PUT",
      body: JSON.stringify(hospitalData),
    });
    return this.parseResponse(response);
  }

  async deleteHospital(id) {
    const response = await this.request(`/api/admin/hospitals/${id}`, {
      method: "DELETE",
    });
    return this.parseResponse(response);
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token;
  }

  // Get current admin info from token
  getAdminInfo() {
    if (!this.token) return null;

    try {
      // Decode JWT token (simple base64 decode of payload)
      const payload = this.token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.adminId,
        username: decoded.username,
        email: decoded.email,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      this.clearToken();
      return null;
    }
  }

  // Logout method
  async logout() {
    try {
      // Call backend logout endpoint to clear session
      await fetch(`${this.baseURL}/api/admin/logout`, {
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
export default new AdminAPI();
