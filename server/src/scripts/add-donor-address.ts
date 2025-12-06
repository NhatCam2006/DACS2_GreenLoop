import axios from "axios";

const API_URL = "http://localhost:4000/api";

async function addDonorAddress() {
  try {
    console.log("🔐 Logging in as donor...");

    // 1. Login as donor
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: "donor@greenloop.local",
      password: "Donor@123",
    });

    const { token, user } = loginResponse.data;
    console.log("✅ Logged in as:", user.email);

    // 2. Check existing addresses
    console.log("\n📍 Checking existing addresses...");
    const existingAddresses = await axios.get(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Existing addresses:", existingAddresses.data);

    if (existingAddresses.data && existingAddresses.data.length > 0) {
      console.log("\n✅ Donor already has addresses!");
      console.log("Total addresses:", existingAddresses.data.length);
      return;
    }

    // 3. Create address
    console.log("\n📍 Creating new address...");

    const addressResponse = await axios.post(
      `${API_URL}/addresses`,
      {
        street: "123 Green Street",
        ward: "Ward 1",
        district: "District 1",
        city: "Ho Chi Minh City",
        latitude: 10.762622,
        longitude: 106.660172,
        isPrimary: true,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Address created:", addressResponse.data.address);
    console.log("\n🎉 Success! Donor now has an address.");
    console.log("\nYou can now create a donation request!");
  } catch (error: any) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

addDonorAddress();

