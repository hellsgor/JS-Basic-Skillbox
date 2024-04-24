import axios from 'axios';

class ClientsApi {
  URL = 'http://localhost:3000/api/';

  RESOURCES = {
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

  async getClient(props) {
    try {
      const response = await axios.get(
        `${this.URL}${this.RESOURCES.CLIENTS}/${props.id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Невозможно получить данные из-за ошибки: ${error}`);
      throw error;
    }
  }

  async deleteClient(props) {
    let response;
    try {
      response = await axios.delete(
        `${this.URL}${this.RESOURCES.CLIENTS}/${props.id}`,
      );
      return response;
    } catch (error) {
      console.error(`Невозможно отправить данные из-за ошибки: ${error}`);
      return { error };
    }
  }

  async editClient(props) {
    let response;
    try {
      response = await axios.patch(
        `${this.URL}${this.RESOURCES.CLIENTS}/${props.id}`,
        props.data,
      );
      return response;
    } catch (error) {
      console.error(`Невозможно отправить данные из-за ошибки: ${error}`);
      return { error };
    }
  }

  async addClient(props) {
    let response;
    try {
      response = await axios.post(
        `${this.URL}${this.RESOURCES.CLIENTS}`,
        props.data,
      );
      return response;
    } catch (error) {
      console.error(`Невозможно отправить данные из-за ошибки: ${error}`);
      return { error };
    }
  }
}

const clientsApi = new ClientsApi();
export default clientsApi;
