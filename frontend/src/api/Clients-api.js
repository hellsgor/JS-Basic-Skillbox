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
    } catch (e) {
      console.error(`Невозможно получить данные из-за ошибки: ${e}`);
      throw e;
    }
  }

  async addClient(data) {
    try {
      const response = await axios.post(
        `${this.URL}${this.RESOURCES.CLIENTS}`,
        data,
      );
      return response.data;
    } catch (e) {
      console.error(`Невозможно отправить данные из-за ошибки: ${e}`);
      throw e;
    }
  }
}

const clientsApi = new ClientsApi();
export default clientsApi;
