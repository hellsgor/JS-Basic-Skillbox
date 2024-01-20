import axios from 'axios';

export class GetDataApi {
  URL = 'http://localhost:3000/api/';

  RESOURCES = {
    CLIENT: 'client',
    CLIENTS: 'clients',
  };

  async getContacts() {
    try {
      const response = await axios.get(`${this.URL}${this.RESOURCES.CLIENTS}`);
      return response.data;
    } catch (e) {
      console.error(`Невозможно получить данные из-за ошибки: ${e}`);
      throw e;
    }
  }
}
