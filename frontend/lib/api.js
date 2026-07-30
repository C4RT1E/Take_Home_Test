// i like tacos

const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes(':5000')) {
    return envUrl;
  }
  return 'http://localhost:5001';
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generic request wrapper around native fetch
 */
async function request(endpoint, options = {}) {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const config = {
    mode: 'cors',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (data && typeof data === 'object' && data.error)
        ? data.error
        : `HTTP Error ${response.status}`;
      throw new ApiError(errorMessage, response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or parse error
    console.error('API Request Error:', error);
    throw new ApiError(error.message || 'Failed to communicate with server', 500);
  }
}

export const api = {
  /**
   * Fetch all todos
   */
  getTodos: () => request('/todos', { method: 'GET' }),

  /**
   * Create a new todo
   */
  createTodo: (todoData) =>
    request('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData)
    }),

  /**
   * Update an existing todo
   */
  updateTodo: (id, updates) =>
    request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  /**
   * Delete a todo by ID
   */
  deleteTodo: (id) =>
    request(`/todos/${id}`, {
      method: 'DELETE'
    })
};
