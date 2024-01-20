import '@styles/style.scss';
import { GetDataApi } from './src/api/get-data-api';

const getDataApi = new GetDataApi();

const contacts = await getDataApi.getContacts();
console.log(contacts);
