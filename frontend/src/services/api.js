import axios from 'axios';

// Crea un'istanza di Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Come da specifiche
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per le Richieste
apiClient.interceptors.request.use(
  (config) => {
    // Prova a prendere il token da localStorage
    // In futuro, questo potrebbe interagire con lo store Pinia
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Gestisci l'errore della richiesta
    return Promise.reject(error);
  }
);

// Interceptor per le Risposte
apiClient.interceptors.response.use(
  (response) => {
    // Qualsiasi codice di stato che si trova all'interno dell'intervallo di 2xx causa l'attivazione di questa funzione
    return response;
  },
  (error) => {
    // Qualsiasi codice di stato che non rientra nell'intervallo di 2xx causa l'attivazione di questa funzione
    if (error.response) {
      // La richiesta è stata fatta e il server ha risposto con un codice di stato
      // che non rientra nell'intervallo di 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status Code:', error.response.status);
      console.error('Headers:', error.response.headers);

      if (error.response.status === 401) {
        // Gestione dell'errore 401 Unauthorized
        console.warn('Unauthorized (401). Token might be invalid or expired.');
        // Qui, in futuro, si attiverà il logout programmatico:
        // 1. Chiamare l'azione logout dello store Pinia (authStore.logout())
        // 2. Rimuovere i token da localStorage (già fatto da authStore.logout())
        // 3. Reindirizzare alla pagina di login (router.push('/login'))
        // Per ora, ci limitiamo a un console.warn e a rimuovere il token se presente,
        // per evitare che richieste successive continuino a fallire con lo stesso token.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Potrebbe essere utile ricaricare la pagina o reindirizzare,
        // ma senza il router configurato è prematuro.
        // window.location.href = '/login'; // Questo è un approccio hard, meglio il router
      }
    } else if (error.request) {
      // La richiesta è stata fatta ma non è stata ricevuta alcuna risposta
      console.error('API No Response:', error.request);
    } else {
      // Qualcosa è successo nell'impostazione della richiesta che ha generato un Errore
      console.error('API Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
