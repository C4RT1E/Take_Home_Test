const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes(':5000')) {
    return envUrl;
  }
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && !envUrl) {
    return '';
  }
  return 'http://localhost:5001';
};

const getUserId = () => {
  if (typeof window === 'undefined') return 'server_guest';
  let userId = localStorage.getItem('todo_tracker_user_id');
  if (!userId) {
    userId = 'usr_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('todo_tracker_user_id', userId);
  }
  return userId;
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
  const userId = getUserId();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-User-Id': userId
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
    console.error('API Request Error:', error);
    throw new ApiError(error.message || 'Failed to communicate with server', 500);
  }
}

export const api = {
  getTodos: () => request('/todos', { method: 'GET' }),

  createTodo: (todoData) =>
    request('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData)
    }),

  updateTodo: (id, updates) =>
    request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteTodo: (id) =>
    request(`/todos/${id}`, {
      method: 'DELETE'
    })
};
