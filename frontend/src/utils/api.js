const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  return url.endsWith('/api') ? url.replace('/api', '') : url;
};

export const fetchApi = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};
