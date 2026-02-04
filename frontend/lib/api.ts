const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiOptions extends RequestInit {
  token?: string;
}

async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (fetchOptions.headers) {
    Object.assign(headers, fetchOptions.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  register: (username: string, email: string, password: string) =>
    apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
  
  getMe: (token: string) =>
    apiCall('/api/auth/me', { token }),
  
  changePassword: (oldPassword: string, newPassword: string, token: string) =>
    apiCall('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      token,
    }),
};

// Hero API
export const heroApi = {
  getAll: () => apiCall('/api/hero'),
  getById: (id: number) => apiCall(`/api/hero/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/hero', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/hero/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/hero/${id}`, { method: 'DELETE', token }),
  updateOrder: (items: Array<{ id: number; order_index: number }>, token: string) =>
    apiCall('/api/hero/reorder', { method: 'PUT', body: JSON.stringify({ items }), token }),
};

// About API
export const aboutApi = {
  getAll: () => apiCall('/api/about'),
  getById: (id: number) => apiCall(`/api/about/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/about', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/about/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/about/${id}`, { method: 'DELETE', token }),
};

// Skills API
export const skillsApi = {
  getAll: (category?: string) =>
    apiCall(`/api/skills${category ? `?category=${category}` : ''}`),
  getById: (id: number) => apiCall(`/api/skills/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/skills', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/skills/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/skills/${id}`, { method: 'DELETE', token }),
};

// Projects API
export const projectsApi = {
  getAll: (featured?: boolean) =>
    apiCall(`/api/projects${featured !== undefined ? `?featured=${featured}` : ''}`),
  getById: (id: number) => apiCall(`/api/projects/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/projects', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/projects/${id}`, { method: 'DELETE', token }),
};

// Experience API
export const experienceApi = {
  getAll: () => apiCall('/api/experience'),
  getById: (id: number) => apiCall(`/api/experience/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/experience', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/experience/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/experience/${id}`, { method: 'DELETE', token }),
};

// Education API
export const educationApi = {
  getAll: () => apiCall('/api/education'),
  getById: (id: number) => apiCall(`/api/education/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/education', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/education/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/education/${id}`, { method: 'DELETE', token }),
};

// Blog API
export const blogApi = {
  getAll: (filters?: { status?: string; category?: string; featured?: boolean; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    return apiCall(`/api/blog/?${params.toString()}`);
  },
  getById: (id: number) => apiCall(`/api/blog/${id}`),
  getBySlug: (slug: string) => apiCall(`/api/blog/slug/${slug}`),
  create: (data: any, token: string) =>
    apiCall('/api/blog/', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/blog/${id}`, { method: 'DELETE', token }),
  getCategories: () => apiCall('/api/blog/categories/list'),
  getTags: () => apiCall('/api/blog/tags/list'),
};

// Testimonials API
export const testimonialsApi = {
  getAll: () => apiCall('/api/testimonials'),
  getById: (id: number) => apiCall(`/api/testimonials/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/testimonials', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/testimonials/${id}`, { method: 'DELETE', token }),
};

// Services API
export const servicesApi = {
  getAll: () => apiCall('/api/services'),
  getById: (id: number) => apiCall(`/api/services/${id}`),
  create: (data: any, token: string) =>
    apiCall('/api/services', { method: 'POST', body: JSON.stringify(data), token }),
  update: (id: number, data: any, token: string) =>
    apiCall(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/services/${id}`, { method: 'DELETE', token }),
};

// Contact API
export const contactApi = {
  submit: (data: { name: string; email: string; subject?: string; message: string }) =>
    apiCall('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: (token: string) =>
    apiCall('/api/contact-messages', { token }),
  updateMessageStatus: (id: number, status: string, token: string) =>
    apiCall(`/api/contact-messages/${id}`, { method: 'PUT', body: JSON.stringify({ status }), token }),
  deleteMessage: (id: number, token: string) =>
    apiCall(`/api/contact-messages/${id}`, { method: 'DELETE', token }),
};

// SEO API
export const seoApi = {
  getPages: () => apiCall('/api/seo/pages'),
  getPage: (pageName: string) => apiCall(`/api/seo/pages/${pageName}`),
  createPage: (data: any, token: string) =>
    apiCall('/api/seo/pages', { method: 'POST', body: JSON.stringify(data), token }),
  updatePage: (pageName: string, data: any, token: string) =>
    apiCall(`/api/seo/pages/${pageName}`, { method: 'PUT', body: JSON.stringify(data), token }),
  deletePage: (pageName: string, token: string) =>
    apiCall(`/api/seo/pages/${pageName}`, { method: 'DELETE', token }),
  getSitemap: () => fetch(`${API_URL}/api/seo/sitemap.xml`).then(r => r.text()),
  getRobotsTxt: () => fetch(`${API_URL}/api/seo/robots.txt`).then(r => r.text()),
  updateRobotsTxt: (content: string, token: string) =>
    apiCall('/api/seo/robots.txt', { method: 'PUT', body: JSON.stringify(content), token }),
  getSeoScore: (token: string) => apiCall('/api/seo/score', { token }),
};

// Theme API
export const themeApi = {
  get: () => apiCall('/api/theme/'),
  update: (data: any, token: string) =>
    apiCall('/api/theme/', { method: 'PUT', body: JSON.stringify(data), token }),
  getGoogleFonts: () => apiCall('/api/theme/fonts/google'),
  reset: (token: string) =>
    apiCall('/api/theme/reset', { method: 'POST', token }),
};

// Resume API
export const resumeApi = {
  getAll: () => apiCall('/api/resume/'),
  getActive: () => apiCall('/api/resume/active'),
  upload: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/api/resume/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
  activate: (id: number, token: string) =>
    apiCall(`/api/resume/${id}/activate`, { method: 'PUT', token }),
  delete: (id: number, token: string) =>
    apiCall(`/api/resume/${id}`, { method: 'DELETE', token }),
  downloadUrl: (id: number) => `${API_URL}/api/resume/${id}/download`,
  downloadActiveUrl: () => `${API_URL}/api/resume/download/active`,
};

// Settings API
export const settingsApi = {
  get: () => apiCall('/api/settings/'),
  update: (data: any, token: string) =>
    apiCall('/api/settings/', { method: 'PUT', body: JSON.stringify(data), token }),
  backup: (token: string) =>
    apiCall('/api/settings/backup', { method: 'POST', token }),
  getBackups: (token: string) =>
    apiCall('/api/settings/backups', { token }),
  restore: (filename: string, token: string) =>
    apiCall(`/api/settings/restore/${filename}`, { method: 'POST', token }),
  uploadAsset: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/api/settings/upload-asset`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
  getActivityLogs: (token: string, limit?: number) =>
    apiCall(`/api/settings/activity-logs${limit ? `?limit=${limit}` : ''}`, { token }),
  exportData: (token: string) =>
    apiCall('/api/settings/export-data', { method: 'POST', token }),
  getStats: (token: string) =>
    apiCall('/api/settings/stats', { token }),
};

export const api = {
  auth: authApi,
  hero: heroApi,
  about: aboutApi,
  skills: skillsApi,
  projects: projectsApi,
  experience: experienceApi,
  education: educationApi,
  blog: blogApi,
  testimonials: testimonialsApi,
  services: servicesApi,
  contact: contactApi,
  seo: seoApi,
  theme: themeApi,
  resume: resumeApi,
  settings: settingsApi,
};
