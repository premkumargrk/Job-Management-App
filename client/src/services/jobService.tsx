import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const getJobs = async (filters = {}) => {
  try {    
    const res = await axios.get(`${BASE_URL}/jobs`, { params: filters });
    if (res.data.status) {
      return {
        success: true,
        data: res.data.data,
        message: res.data.message,
      };
    } else {
      return {
        success: false,
        data: null,
        message: res.data.message || 'Failed to fetch jobs',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || 'Network or server error',
    };
  }
};

export const createJob = async (job: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/job`, job);
    if (res.data.status) {
      return {
        success: true,
        data: res.data.data,
        message: res.data.message,
      };
    } else {
      return {
        success: false,
        data: null,
        message: res.data.message || 'Failed to create job',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || 'Network or server error',
    };
  }
};

export const getLocations = async () => {  
  try {
    const res = await axios.get(`${BASE_URL}/locations`);
    if (res.data.status) {
      return {
        success: true,
        data: res.data.data,
        message: res.data.message,
      };
    } else {
      return {
        success: false,
        data: null,
        message: res.data.message || 'Failed to fetch locations',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || 'Network or server error',
    };
  }
};

export const getMinMaxSalary = async () => {  
  try {
    const res = await axios.get(`${BASE_URL}/salary_min_max`);
    if (res.data.status) {
      return {
        success: true,
        data: res.data.data,
        message: res.data.message,
      };
    } else {
      return {
        success: false,
        data: null,
        message: res.data.message || 'Failed to fetch salary',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || 'Network or server error',
    };
  }
};