import axios from 'axios';

/**
 * Класс для взаимодействия с API клиентов.
 */
class ClientsApi {
  /**
   * Конструктор класса ClientsApi.
   * Создает экземпляр axios с базовым URL.
   */
  constructor() {
    /**
     * Ресурс API для клиентов.
     * @type {string}
     */
    this.resource = 'clients';

    /**
     * Экземпляр axios для HTTP-запросов.
     * @type {axios.AxiosInstance}
     */
    this.api = axios.create({
      baseURL: 'http://localhost:3000/api/',
    });
  }

  /**
   * Получение списка клиентов.
   * @returns {Promise<Object[]>} Массив клиентов.
   */
  async getClients() {
    try {
      const response = await this.api.get(this.resource);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Получение информации о клиенте по его ID.
   * @param {Object} props - Параметры запроса.
   * @param {number} props.id - ID клиента.
   * @returns {Promise<Object>} Данные клиента.
   */
  async getClient(props) {
    try {
      const response = await this.api.get(`${this.resource}/${props.id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Удаление клиента по его ID.
   * @param {Object} props - Параметры запроса.
   * @param {number} props.id - ID клиента.
   * @returns {Promise<axios.AxiosResponse>} Ответ сервера.
   */
  async deleteClient(props) {
    try {
      const response = await this.api.delete(`${this.resource}/${props.id}`);
      return response;
    } catch (error) {
      this.handleError(error);
      return error;
    }
  }

  /**
   * Редактирование данных клиента.
   * @param {Object} props - Параметры запроса.
   * @param {number} props.id - ID клиента.
   * @param {Object} props.data - Новые данные клиента.
   * @returns {Promise<axios.AxiosResponse>} Ответ сервера.
   */
  async editClient(props) {
    try {
      const response = await this.api.patch(
        `${this.resource}/${props.id}`,
        props.data,
      );
      return response;
    } catch (error) {
      this.handleError(error);
      return error;
    }
  }

  /**
   * Добавление нового клиента.
   * @param {Object} props - Параметры запроса.
   * @param {Object} props.data - Данные нового клиента.
   * @returns {Promise<axios.AxiosResponse>} Ответ сервера.
   */
  async addClient(props) {
    try {
      const response = await this.api.post(this.resource, props.data);
      return response;
    } catch (error) {
      this.handleError(error);
      return error;
    }
  }

  /**
   * Поиск клиентов по строке запроса.
   * @param {Object} props - Параметры запроса.
   * @param {string} props.searchString - Строка поиска.
   * @returns {Promise<Object[]>} Найденные клиенты.
   */
  async searchClients({ searchString }) {
    try {
      const response = await this.api.get(this.resource, {
        params: { search: searchString },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return error;
    }
  }

  /**
   * Обработка ошибок HTTP-запросов.
   * @param {Error} error - Ошибка запроса.
   */
  handleError(error) {
    console.error(`Невозможно выполнить операцию из-за ошибки: ${error}`);
  }
}

const clientsApi = new ClientsApi();
export default clientsApi;
