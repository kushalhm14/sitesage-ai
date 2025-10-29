// API Configuration and Service
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

// API Error Handler
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API Request Function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        response.status,
        data.message || `API Error: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error('Network error. Please check if the backend server is running.');
  }
}

// ============ AUTH API ============
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============ ANALYSIS API ============
export interface URLAnalysisRequest {
  url: string;
  keyword: string;
  industry?: string;
  competitor?: string;
  focus?: {
    technicalSEO?: boolean;
    content?: boolean;
    keywords?: boolean;
    ux?: boolean;
  };
}

export interface ManualStrategyRequest {
  businessName: string;
  industry: string;
  description: string;
  targetAudience: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  geographic?: string;
  contentGoals?: {
    blogStrategy?: boolean;
    metaTags?: boolean;
    landingPages?: boolean;
    socialMedia?: boolean;
    productDesc?: boolean;
  };
}

export interface AnalysisResult {
  success: boolean;
  analysis: {
    _id: string;
    url?: string;
    businessName?: string;
    results: {
      seoScore: number;
      aeoScore: number;
      overallScore: number;
      recommendations: Array<{
        title: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
        category: string;
        code?: string;
      }>;
      metrics: {
        technicalSEO?: any;
        contentQuality?: any;
        keywordOptimization?: any;
        userExperience?: any;
      };
      keywordStrategy?: {
        primary: string;
        lsi: string[];
        longTail: string[];
      };
      metaTags?: {
        title: string;
        description: string;
        ogTitle: string;
        ogDescription: string;
      };
      contentSuggestions?: Array<{
        title: string;
        type: string;
        keyword: string;
        outline: string[];
      }>;
    };
    scrapedContent?: any;
    geminiResponse: string;
    createdAt: string;
  };
}

export interface AnalysisHistory {
  success: boolean;
  analyses: Array<{
    _id: string;
    url?: string;
    businessName?: string;
    results: {
      seoScore: number;
      aeoScore: number;
      overallScore: number;
    };
    createdAt: string;
  }>;
}

export const analysisAPI = {
  analyzeURL: async (data: URLAnalysisRequest): Promise<AnalysisResult> => {
    return apiRequest<AnalysisResult>('/analysis/analyze-url', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  generateStrategy: async (data: ManualStrategyRequest): Promise<AnalysisResult> => {
    return apiRequest<AnalysisResult>('/analysis/generate-strategy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getHistory: async (): Promise<AnalysisHistory> => {
    return apiRequest<AnalysisHistory>('/analysis/history');
  },
};

// ============ HELPER FUNCTIONS ============
export const saveAuthData = (token: string, user: any) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
