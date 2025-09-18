import { api, endpoints } from '@/lib/api-client';
import { State, District, Village, User, UserRole } from '@/lib/types/api';

export interface AdminStats {
  states: number;
  districts: number;
  villages: number;
  users: number;
  claims: number;
  schemes: number;
}

export interface BulkCreateStateRequest {
  states: Array<{
    name: string;
    code: string;
  }>;
}

export interface BulkCreateDistrictRequest {
  districts: Array<{
    name: string;
    code?: string;
    stateId: string;
    boundary: string; // GeoJSON string
  }>;
}

export interface BulkCreateVillageRequest {
  villages: Array<{
    name: string;
    districtId: string;
    coordinates: string; // GeoJSON point
    boundary?: string; // GeoJSON polygon
  }>;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  villageId?: string;
}

export interface SeedDataRequest {
  includeStates?: boolean;
  includeDistricts?: boolean;
  includeVillages?: boolean;
  includeUsers?: boolean;
  includeSchemes?: boolean;
  stateCode?: string; // For seeding specific state data
}

export const adminService = {
  // Get dashboard statistics
  async getStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>(endpoints.admin.stats);
    return response.data;
  },

  // Bulk operations
  async bulkCreateStates(data: BulkCreateStateRequest): Promise<State[]> {
    const response = await api.post<State[]>(endpoints.admin.bulk.states, data);
    return response.data;
  },

  async bulkCreateDistricts(data: BulkCreateDistrictRequest): Promise<District[]> {
    const response = await api.post<District[]>(endpoints.admin.bulk.districts, data);
    return response.data;
  },

  async bulkCreateVillages(data: BulkCreateVillageRequest): Promise<Village[]> {
    const response = await api.post<Village[]>(endpoints.admin.bulk.villages, data);
    return response.data;
  },

  // User management
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>(endpoints.admin.users, userData);
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>(endpoints.admin.users);
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`${endpoints.admin.users}/${userId}`);
  },

  // Data seeding
  async seedData(request: SeedDataRequest): Promise<{ message: string; seeded: any }> {
    const response = await api.post(endpoints.admin.seed, request);
    return response.data;
  },

  // Predefined data seeds
  async seedIndianStates(): Promise<State[]> {
    const indianStates = [
      { name: "Andhra Pradesh", code: "AP" },
      { name: "Arunachal Pradesh", code: "AR" },
      { name: "Assam", code: "AS" },
      { name: "Bihar", code: "BR" },
      { name: "Chhattisgarh", code: "CG" },
      { name: "Goa", code: "GA" },
      { name: "Gujarat", code: "GJ" },
      { name: "Haryana", code: "HR" },
      { name: "Himachal Pradesh", code: "HP" },
      { name: "Jharkhand", code: "JH" },
      { name: "Karnataka", code: "KA" },
      { name: "Kerala", code: "KL" },
      { name: "Madhya Pradesh", code: "MP" },
      { name: "Maharashtra", code: "MH" },
      { name: "Manipur", code: "MN" },
      { name: "Meghalaya", code: "ML" },
      { name: "Mizoram", code: "MZ" },
      { name: "Nagaland", code: "NL" },
      { name: "Odisha", code: "OR" },
      { name: "Punjab", code: "PB" },
      { name: "Rajasthan", code: "RJ" },
      { name: "Sikkim", code: "SK" },
      { name: "Tamil Nadu", code: "TN" },
      { name: "Telangana", code: "TG" },
      { name: "Tripura", code: "TR" },
      { name: "Uttar Pradesh", code: "UP" },
      { name: "Uttarakhand", code: "UK" },
      { name: "West Bengal", code: "WB" },
      // Union Territories
      { name: "Andaman and Nicobar Islands", code: "AN" },
      { name: "Chandigarh", code: "CH" },
      { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DH" },
      { name: "Delhi", code: "DL" },
      { name: "Jammu and Kashmir", code: "JK" },
      { name: "Ladakh", code: "LA" },
      { name: "Lakshadweep", code: "LD" },
      { name: "Puducherry", code: "PY" },
    ];

    return this.bulkCreateStates({ states: indianStates });
  },

  // Sample district data (for Odisha as example)
  async seedOdishaDistricts(stateId: string): Promise<District[]> {
    const odishaDistricts = [
      { name: "Angul", code: "ANG", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Balangir", code: "BAL", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Balasore", code: "BLS", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Bargarh", code: "BAR", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Bhadrak", code: "BHD", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Boudh", code: "BOU", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Cuttack", code: "CTC", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Deogarh", code: "DEO", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Dhenkanal", code: "DHE", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Gajapati", code: "GAJ", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Ganjam", code: "GAN", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Jagatsinghpur", code: "JAG", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Jajpur", code: "JAJ", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Jharsuguda", code: "JHA", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Kalahandi", code: "KAL", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Kandhamal", code: "KAN", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Kendrapara", code: "KEN", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Kendujhar", code: "KEO", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Khordha", code: "KHO", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Koraput", code: "KOR", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Malkangiri", code: "MAL", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Mayurbhanj", code: "MAY", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Nabarangpur", code: "NAB", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Nayagarh", code: "NAY", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Nuapada", code: "NUA", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Puri", code: "PUR", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Rayagada", code: "RAY", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Sambalpur", code: "SAM", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Subarnapur", code: "SUB", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
      { name: "Sundargarh", code: "SUN", boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }) },
    ];

    const districts = odishaDistricts.map(district => ({
      ...district,
      stateId,
    }));

    return this.bulkCreateDistricts({ districts });
  },

  // Sample village data (for a specific district)
  async seedSampleVillages(districtId: string): Promise<Village[]> {
    const sampleVillages = [
      { 
        name: "Lembujharan", 
        coordinates: JSON.stringify({ type: "Point", coordinates: [85.8245, 21.9162] }),
        boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] })
      },
      { 
        name: "Baripada", 
        coordinates: JSON.stringify({ type: "Point", coordinates: [86.7346, 21.9347] }),
        boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] })
      },
      { 
        name: "Jashipur", 
        coordinates: JSON.stringify({ type: "Point", coordinates: [85.8456, 21.9347] }),
        boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] })
      },
      { 
        name: "Rairangpur", 
        coordinates: JSON.stringify({ type: "Point", coordinates: [86.1789, 22.1234] }),
        boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] })
      },
      { 
        name: "Udala", 
        coordinates: JSON.stringify({ type: "Point", coordinates: [86.5432, 21.8765] }),
        boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] })
      },
    ];

    const villages = sampleVillages.map(village => ({
      ...village,
      districtId,
    }));

    return this.bulkCreateVillages({ villages });
  },

  // Create sample admin users
  async seedSampleUsers(): Promise<User[]> {
    const sampleUsers = [
      {
        name: "System Administrator",
        email: "admin@gov.in",
        password: "admin123",
        role: UserRole.DistrictCommittee,
      },
      {
        name: "District Collector",
        email: "dc.mayurbhanj@gov.in", 
        password: "dc123",
        role: UserRole.DistrictCommittee,
      },
      {
        name: "SDLC Officer",
        email: "sdlc.jashipur@gov.in",
        password: "sdlc123", 
        role: UserRole.SubDivisionalCommittee,
      },
      {
        name: "Gram Panchayat Secretary",
        email: "gp.lembujharan@gov.in",
        password: "gp123",
        role: UserRole.GramSabha,
      },
      {
        name: "Village Representative",
        email: "village.lembujharan@gov.in",
        password: "village123",
        role: UserRole.VillagePerson,
      },
    ];

    const users = [];
    for (const userData of sampleUsers) {
      try {
        const user = await this.createUser(userData);
        users.push(user);
      } catch (error) {
        console.error(`Failed to create user ${userData.email}:`, error);
      }
    }

    return users;
  },

  // Export all data
  async exportData(): Promise<Blob> {
    const response = await api.get(endpoints.admin.export, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Import data from file
  async importData(file: File): Promise<{ message: string; imported: any }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Quick setup - seed everything needed for demo
  async quickSetup(): Promise<{ message: string; results: any }> {
    try {
      console.log('Starting quick setup process...');
      
      // 1. Seed Indian states
      console.log('Step 1: Seeding Indian states...');
      const states = await this.seedIndianStates();
      console.log(`Created ${states.length} states`);
      
      // 2. Find Odisha state and seed its districts
      const odisha = states.find(s => s.code === 'OR');
      let districts = [];
      let villages = [];
      
      if (odisha) {
        console.log('Step 2: Seeding Odisha districts...');
        districts = await this.seedOdishaDistricts(odisha.id);
        console.log(`Created ${districts.length} districts`);
        
        // 3. Seed villages for Mayurbhanj district
        const mayurbhanj = districts.find(d => d.name === 'Mayurbhanj');
        if (mayurbhanj) {
          console.log('Step 3: Seeding sample villages...');
          villages = await this.seedSampleVillages(mayurbhanj.id);
          console.log(`Created ${villages.length} villages`);
        }
      }
      
      // 4. Create sample users
      console.log('Step 4: Creating sample users...');
      const users = await this.seedSampleUsers();
      console.log(`Created ${users.length} users`);
      
      const result = {
        message: 'Quick setup completed successfully',
        results: {
          states: states.length,
          districts: districts.length,
          villages: villages.length,
          users: users.length,
        }
      };
      
      console.log('Quick setup completed:', result);
      return result;
    } catch (error) {
      console.error('Quick setup error:', error);
      throw new Error(`Quick setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
