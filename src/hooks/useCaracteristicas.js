import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.js';
import { IS_DEMO_MODE } from '../config/demo.js';
import { MOCK_CARACTERISTICAS, MOCK_CARACTERISTICAS_BY_SERVICIO } from '../mock/data.js';

/**
 * Hook to fetch and manage características; uses mock data in demo mode.
 */
const useCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (IS_DEMO_MODE) {
      setCaracteristicas(MOCK_CARACTERISTICAS);
      setError(null);
      setLoading(false);
      return;
    }
    const fetchCaracteristicas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/caracteristicas`);
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setCaracteristicas(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching características:', err);
        setError(err.message);
        setCaracteristicas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCaracteristicas();
  }, []);

  /**
   * Obtener una característica por su ID
   * @param {number} id - ID de la característica a obtener
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const getCaracteristicaById = async (id) => {
    if (IS_DEMO_MODE) {
      const c = MOCK_CARACTERISTICAS.find((x) => x.id_caracteristica === parseInt(id));
      return c ? { success: true, data: c } : { success: false, error: 'Not found' };
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/caracteristicas/${id}`);
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      const caracteristica = await response.json();
      return { success: true, data: caracteristica };
    } catch (err) {
      console.error('Error fetching característica:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener los servicios asociados a una característica
   * @param {number} id - ID de la característica
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const getServiciosByCaracteristica = async (id) => {
    if (IS_DEMO_MODE) {
      const servicioIds = Object.entries(MOCK_CARACTERISTICAS_BY_SERVICIO)
        .filter(([, arr]) => arr.some((c) => c.id_caracteristica === parseInt(id)))
        .map(([sid]) => ({ id_servicio: parseInt(sid) }));
      return { success: true, data: servicioIds };
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/caracteristicas/${id}/servicios`);
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      const servicios = await response.json();
      return { success: true, data: servicios };
    } catch (err) {
      console.error('Error fetching servicios for característica:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear una nueva característica (requiere autenticación de administrador)
   * @param {Object} caracteristicaData - Datos de la característica a crear
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const createCaracteristica = async (caracteristicaData) => {
    if (IS_DEMO_MODE) {
      const newId =
        (caracteristicas.length ? Math.max(...caracteristicas.map((c) => c.id_caracteristica)) : 0) + 1;
      const newCar = { id_caracteristica: newId, ...caracteristicaData };
      setCaracteristicas((prev) => [...prev, newCar]);
      return { success: true, data: newCar };
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required. Sign in as administrator.');
      const response = await fetch(`${API_BASE_URL}/caracteristicas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(caracteristicaData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const newCaracteristica = await response.json();
      
      // Actualizar la lista de características localmente
      setCaracteristicas(prevCaracteristicas => [...prevCaracteristicas, newCaracteristica]);
      
      return { success: true, data: newCaracteristica };
    } catch (err) {
      console.error('Error al crear característica:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar una característica existente (requiere autenticación de administrador)
   * @param {number} id - ID de la característica a actualizar
   * @param {Object} caracteristicaData - Nuevos datos de la característica
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const updateCaracteristica = async (id, caracteristicaData) => {
    if (IS_DEMO_MODE) {
      setCaracteristicas((prev) =>
        prev.map((c) => (c.id_caracteristica === parseInt(id) ? { ...c, ...caracteristicaData } : c))
      );
      return { success: true, data: { id_caracteristica: parseInt(id), ...caracteristicaData } };
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required. Sign in as administrator.');
      const response = await fetch(`${API_BASE_URL}/caracteristicas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(caracteristicaData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const updatedCaracteristica = await response.json();
      
      // Actualizar la lista de características localmente
      setCaracteristicas(prevCaracteristicas => 
        prevCaracteristicas.map(car => 
          car.id_caracteristicas === id ? updatedCaracteristica : car
        )
      );
      
      return { success: true, data: updatedCaracteristica };
    } catch (err) {
      console.error('Error al actualizar característica:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar una característica (requiere autenticación de administrador)
   * @param {number} id - ID de la característica a eliminar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const deleteCaracteristica = async (id) => {
    if (IS_DEMO_MODE) {
      setCaracteristicas((prev) => prev.filter((c) => c.id_caracteristica !== parseInt(id)));
      return { success: true };
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required. Sign in as administrator.');
      const response = await fetch(`${API_BASE_URL}/caracteristicas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      // Actualizar la lista de características localmente
      setCaracteristicas(prevCaracteristicas => 
        prevCaracteristicas.filter(car => car.id_caracteristicas !== id)
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar característica:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asociar una característica a un servicio (requiere autenticación de administrador)
   * @param {number} servicioId - ID del servicio
   * @param {number} caracteristicaId - ID de la característica
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const addCaracteristicaToServicio = async (servicioId, caracteristicaId) => {
    if (IS_DEMO_MODE) return { success: true, data: {} };
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required. Sign in as administrator.');
      const requestBody = { id_caracteristicas: caracteristicaId };
      const response = await fetch(`${API_BASE_URL}/servicios/${servicioId}/caracteristicas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If can't parse as JSON, try as text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (textError) {
            // Use the original error message
          }
        }
        console.log('Error response body:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('Success response:', result);
      return { success: true, data: result };
    } catch (err) {
      console.error(`Error al asociar característica #${caracteristicaId} al servicio #${servicioId}:`, err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remover una característica de un servicio (requiere autenticación de administrador)
   * @param {number} servicioId - ID del servicio
   * @param {number} caracteristicaId - ID de la característica
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const removeCaracteristicaFromServicio = async (servicioId, caracteristicaId) => {
    if (IS_DEMO_MODE) return { success: true, data: {} };
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required. Sign in as administrator.');
      const response = await fetch(`${API_BASE_URL}/servicios/${servicioId}/caracteristicas/${caracteristicaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return { success: true, data: result };
    } catch (err) {
      console.error(`Error al remover característica #${caracteristicaId} del servicio #${servicioId}:`, err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener todas las características de un servicio
   * @param {number} servicioId - ID del servicio
   * @returns {Promise<Object>} - Resultado de la operación
   */
  const getCaracteristicasByServicio = async (servicioId) => {
    if (IS_DEMO_MODE) {
      const sid = parseInt(servicioId);
      const data = MOCK_CARACTERISTICAS_BY_SERVICIO[sid] || [];
      return { success: true, data };
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/servicios/${servicioId}/caracteristicas`);
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      const caracteristicasServicio = await response.json();
      return { success: true, data: caracteristicasServicio };
    } catch (err) {
      console.error('Error fetching características for service:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    caracteristicas,
    loading,
    error,
    getCaracteristicaById,
    getServiciosByCaracteristica,
    createCaracteristica,
    updateCaracteristica,
    deleteCaracteristica,
    addCaracteristicaToServicio,
    assignCaracteristicaToServicio: addCaracteristicaToServicio,
    removeCaracteristicaFromServicio,
    getCaracteristicasByServicio
  };
};

export default useCaracteristicas; 