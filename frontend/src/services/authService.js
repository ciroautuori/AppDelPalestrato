import apiClient from './api'; // Importa l'istanza Axios configurata

const authService = {
  /**
   * Effettua il login dell'utente.
   * @param {object} credentials - Le credenziali dell'utente.
   * @param {string} credentials.email - L'email dell'utente.
   * @param {string} credentials.password - La password dell'utente.
   * @returns {Promise} La promessa della risposta Axios.
   */
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Recupera i dati dell'utente attualmente autenticato.
   * Presuppone che il token JWT sia già stato impostato nell'header Authorization
   * dall'interceptor di apiClient.
   * @returns {Promise} La promessa della risposta Axios.
   */
  fetchCurrentUser: () => {
    return apiClient.get('/users/me');
  },

  // In futuro, si potrebbe aggiungere qui una funzione per il logout lato backend,
  // se venisse implementato un endpoint apposito (es. per invalidare il token).
  // logoutBackend: () => {
  //   return apiClient.post('/auth/logout');
  // }
};

export default authService;
