import axios from 'axios';

class ClientsApi {
  resource = 'clients';

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000/api/',
    });
  }

  async getClients() {
    try {
      const response = await this.api.get(this.resource);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getClient(props) {
    try {
      const response = await this.api.get(`${this.resource}/${props.id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteClient(props) {
    try {
      const response = await this.api.delete(`${this.resource}/${props.id}`);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async editClient(props) {
    try {
      const response = await this.api.patch(
        `${this.resource}/${props.id}`,
        props.data,
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async addClient(props) {
    try {
      const response = await this.api.post(this.resource, props.data);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error(`Невозможно выполнить операцию из-за ошибки: ${error}`);
    throw error;
  }
}

const clientsApi = new ClientsApi();
export default clientsApi;
