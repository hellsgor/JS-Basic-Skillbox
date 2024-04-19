import axios from 'axios';

class ClientsApi {
  URL = 'http://localhost:3000/api/';

  RESOURCES = {
    CLIENT: 'client',
    CLIENTS: 'clients',
  };

  async getClients() {
    try {
      const response = await axios.get(`${this.URL}${this.RESOURCES.CLIENTS}`);
      return response.data;
    } catch (error) {
      console.error(`Невозможно получить данные из-за ошибки: ${error}`);
      throw error;
    }
  }

  async addClient(data) {
    let response;
    try {
      response = await axios.post(`${this.URL}${this.RESOURCES.CLIENTS}`, data);
      return response;
    } catch (error) {
      console.error(`Невозможно отправить данные из-за ошибки: ${error}`);
      return { error };
    }
  }
}

const clientsApi = new ClientsApi();
export default clientsApi;
