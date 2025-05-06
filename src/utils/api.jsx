const API_URL = "http://localhost:8080/admin";
const API_AUTH_URL = "http://localhost:8080/login/admin";

const fetchData = async (endpoint, User) => {
  const token = localStorage.getItem('token');
  try {
    const url = `${API_URL}/${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const postLogin = async (endpoint, body) => {
  try {
    console.log(API_URL);
    const response = await fetch(`${API_AUTH_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

const postData = async (endpoint, body) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); 
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error posting data:', error);
    throw error; 
  }
};

const updateData = async (endpoint, body) => {
  try {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/${endpoint}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      if (response.status === 422) {
        const error = await response.json();
        throw new Error(JSON.stringify(error.data));
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

const deleteData = async (endpoint, body) => {
  try {
    const token = localStorage.getItem('token');
    let url = `${API_URL}/${endpoint}`;

    if (body) {
      const queryParams = new URLSearchParams(body).toString();
      url += `?${queryParams}`;
    }
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` 
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export { postData, fetchData, postLogin, updateData, deleteData }; 