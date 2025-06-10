import { defineStore } from 'pinia';
import authService from '../services/authService';
// Non importiamo il router qui per evitare dipendenze circolari o gestione dei redirect nello store.
// I redirect saranno gestiti dai componenti o dalle navigation guards.

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Conterrà i dati dell'utente { id, email, role, ecc. }
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null, // Anche se non esplicitamente usato ora, è buona norma gestirlo
    isAuthenticated: false, // Inizialmente falso, diventa true dopo login/fetchUser con successo
  }),

  getters: {
    /**
     * Restituisce il ruolo dell'utente.
     * @param {object} state - Lo stato corrente.
     * @returns {string|undefined} Il ruolo dell'utente o undefined.
     */
    userRole: (state) => state.user?.role,

    /**
     * Verifica se l'utente è autenticato.
     * @param {object} state - Lo stato corrente.
     * @returns {boolean} True se l'utente è autenticato, altrimenti false.
     */
    isUserAuthenticated: (state) => state.isAuthenticated,

    /**
     * Restituisce l'utente corrente.
     * @param {object} state - Lo stato corrente.
     * @returns {object|null} L'oggetto utente o null.
     */
    currentUser: (state) => state.user,
  },

  actions: {
    /**
     * Tenta di effettuare il login dell'utente.
     * @param {object} credentials - Le credenziali ({ email, password }).
     * @returns {Promise<boolean>} True in caso di successo, false altrimenti.
     */
    async login(credentials) {
      try {
        const response = await authService.login(credentials);
        // Assumiamo che il backend restituisca accessToken e opzionalmente refreshToken
        // direttamente nel corpo della risposta (response.data)
        const { accessToken, refreshToken } = response.data;

        if (!accessToken) {
          console.error('Login successful but no accessToken received.');
          await this.logout(); // Pulisce tutto se il token non arriva
          return false;
        }

        this.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);

        if (refreshToken) {
          this.refreshToken = refreshToken;
          localStorage.setItem('refreshToken', refreshToken);
        } else {
          // Se il backend non invia un refreshToken, assicurati di pulire quello vecchio
          this.refreshToken = null;
          localStorage.removeItem('refreshToken');
        }

        // Dopo aver impostato il token, recupera i dati dell'utente
        await this.fetchUser();

        // Se fetchUser ha successo, isAuthenticated sarà true.
        // Se fetchUser fallisce (es. token non valido per /users/me),
        // fetchUser stesso chiamerà logout() che imposterà isAuthenticated a false.
        return this.isAuthenticated;
      } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        await this.logout(); // Assicura la pulizia in caso di errore di login
        return false;
      }
    },

    /**
     * Recupera e memorizza i dati dell'utente autenticato.
     * Chiamato dopo un login riuscito o durante tryToLogin.
     * @returns {Promise<void>}
     */
    async fetchUser() {
      if (!this.accessToken) {
        // Non tentare di recuperare l'utente se non c'è un token
        // Potrebbe essere il caso se tryToLogin è chiamato senza token in localStorage
        // o se il token è stato rimosso.
        // Assicuriamoci che lo stato rifletta la non autenticazione.
        if (this.isAuthenticated) { // Se per qualche motivo era true
             await this.logout(); // Esegui una pulizia completa
        }
        return;
      }

      try {
        const response = await authService.fetchCurrentUser();
        this.user = response.data; // Assumiamo che i dati utente siano in response.data
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Failed to fetch user:', error.response?.data?.message || error.message);
        // Se il recupero dell'utente fallisce (es. token scaduto/invalido),
        // esegui il logout per pulire lo stato.
        await this.logout();
        // Non è necessario restituire false o lanciare un errore qui,
        // poiché logout() ha già resettato lo stato di autenticazione.
      }
    },

    /**
     * Esegue il logout dell'utente.
     * Pulisce lo stato e i token da localStorage.
     */
    async logout() {
      // Opzionale: Chiamata API di logout al backend, se esistente
      // try {
      //   await authService.logoutBackend();
      // } catch (error) {
      //   console.error('Backend logout failed:', error);
      // }

      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // I redirect a /login saranno gestiti dal router o dal componente che chiama logout
      console.log('User logged out, state and localStorage cleared.');
    },

    /**
     * Tenta di ripristinare la sessione utente all'avvio dell'app.
     * Controlla localStorage per i token e, se presenti, tenta di recuperare l'utente.
     * @returns {Promise<void>}
     */
    async tryToLogin() {
      const localToken = localStorage.getItem('accessToken');
      const localRefreshToken = localStorage.getItem('refreshToken');

      if (localToken) {
        this.accessToken = localToken;
        if (localRefreshToken) {
          this.refreshToken = localRefreshToken;
        }
        // Con il token caricato, tenta di recuperare i dati utente
        // fetchUser gestirà il successo (impostando isAuthenticated = true)
        // o il fallimento (chiamando logout() per pulire tutto).
        await this.fetchUser();
      } else {
        // Nessun token in localStorage, assicurati che lo stato sia pulito.
        // Questo è importante se lo stato iniziale di isAuthenticated fosse true per errore.
        if (this.isAuthenticated) {
            await this.logout();
        }
      }
    },
  },
});
