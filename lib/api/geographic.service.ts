import { api, endpoints } from "@/lib/api-client";
import { State, District, Village } from "@/lib/types/api";

export interface CreateStateRequest {
  name: string;
  code: string;
}

export interface CreateDistrictRequest {
  name: string;
  code?: string;
  stateId: string;
  boundary: string; // GeoJSON string
}

export interface CreateVillageRequest {
  name: string;
  districtId: string;
  coordinates: string; // GeoJSON string for Point
  boundary?: string; // GeoJSON string for Polygon
}

export const geographicService = {
  // States
  states: {
    async getAll(): Promise<State[]> {
      const response = await api.get<State[]>(endpoints.states);
      return response.data;
    },

    async getById(id: string): Promise<State> {
      const response = await api.get<State>(`${endpoints.states}/${id}`);
      return response.data;
    },

    async create(stateData: CreateStateRequest): Promise<State> {
      const response = await api.post<State>(endpoints.states, stateData);
      return response.data;
    },

    async update(
      id: string,
      stateData: Partial<CreateStateRequest>,
    ): Promise<State> {
      const response = await api.put<State>(
        `${endpoints.states}/${id}`,
        stateData,
      );
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await api.delete(`${endpoints.states}/${id}`);
    },
  },

  // Districts
  districts: {
    async getAll(): Promise<District[]> {
      const response = await api.get<District[]>(endpoints.districts);
      return response.data;
    },

    async getById(id: string): Promise<District> {
      const response = await api.get<District>(`${endpoints.districts}/${id}`);
      return response.data;
    },

    async getByState(stateId: string): Promise<District[]> {
      const response = await api.get<District[]>(
        `${endpoints.districts}?stateId=${stateId}`,
      );
      return response.data;
    },

    async create(districtData: CreateDistrictRequest): Promise<District> {
      const response = await api.post<District>(
        endpoints.districts,
        districtData,
      );
      return response.data;
    },

    async update(
      id: string,
      districtData: Partial<CreateDistrictRequest>,
    ): Promise<District> {
      const response = await api.put<District>(
        `${endpoints.districts}/${id}`,
        districtData,
      );
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await api.delete(`${endpoints.districts}/${id}`);
    },
  },

  // Villages
  villages: {
    async getAll(): Promise<Village[]> {
      const response = await api.get<Village[]>(endpoints.villages);
      return response.data;
    },

    async getById(id: string): Promise<Village> {
      const response = await api.get<Village>(`${endpoints.villages}/${id}`);
      return response.data;
    },

    async getByDistrict(
      districtId: string,
      search?: string,
    ): Promise<Village[]> {
      const response = await api.get<Village[]>(
        `${endpoints.villages}?districtId=${districtId}${search ? `&search=${search}` : ""}`,
      );
      return response.data;
    },

    async create(villageData: CreateVillageRequest): Promise<Village> {
      const response = await api.post<Village>(endpoints.villages, villageData);
      return response.data;
    },

    async update(
      id: string,
      villageData: Partial<CreateVillageRequest>,
    ): Promise<Village> {
      const response = await api.put<Village>(
        `${endpoints.villages}/${id}`,
        villageData,
      );
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await api.delete(`${endpoints.villages}/${id}`);
    },
  },
};
