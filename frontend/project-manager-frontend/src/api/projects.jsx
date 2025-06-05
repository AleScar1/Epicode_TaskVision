import axios from 'axios';

export const getUserProjects = async (token) => {
  const response = await axios.get('/api/projects', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};