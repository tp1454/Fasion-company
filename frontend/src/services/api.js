import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost/Fashion-company/backend/api', // Updated for Fashion Company
  timeout: 10000
})

// ========== About API ==========

/**
 * Get about information
 */
export const getAbout = async () => {
  try {
    const response = await instance.get('/about.php')
    return response.data
  } catch (error) {
    console.error('Error fetching about:', error)
    throw error
  }
}

/**
 * Update about information (Admin only)
 */
export const updateAbout = async (data, authToken) => {
  try {
    const response = await instance.put('/about.php', data, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating about:', error)
    throw error
  }
}

// ========== FAQ API ==========

/**
 * Get FAQs list with pagination and search
 */
export const getFAQs = async (params = {}) => {
  try {
    const response = await instance.get('/faqs.php', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    throw error
  }
}

/**
 * Get single FAQ by ID
 */
export const getFAQById = async (id) => {
  try {
    const response = await instance.get(`/faqs.php?id=${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    throw error
  }
}

/**
 * Create new FAQ (Admin only)
 */
export const createFAQ = async (data, authToken) => {
  try {
    const response = await instance.post('/faqs.php', data, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating FAQ:', error)
    throw error
  }
}

/**
 * Update FAQ (Admin only)
 */
export const updateFAQ = async (id, data, authToken) => {
  try {
    const response = await instance.put(`/faqs.php?id=${id}`, data, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating FAQ:', error)
    throw error
  }
}

/**
 * Delete FAQ (Admin only)
 */
export const deleteFAQ = async (id, authToken) => {
  try {
    const response = await instance.delete(`/faqs.php?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    throw error
  }
}

export default instance
