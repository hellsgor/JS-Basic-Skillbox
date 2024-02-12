import '@styles/index.scss'
import { ClientsTable } from '@/js/ClientsTable.js'

const clientsTable = new ClientsTable(document.getElementById('table-body'))
await clientsTable.renderClients()
