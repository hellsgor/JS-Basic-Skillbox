import getDataApi from '@api/get-data-api.js'
import { createElement } from '@/helpers/create-element.js'
import { pudZero } from '@/helpers/pud-zero.js'

export class ClientsTable {
  clients = null
  tBody = null

  constructor(tBody) {
    this.tBody = tBody
  }

  async renderClients() {
    await this.initClients()

    this.clients.forEach((client) => {
      const tableRow = createElement({
        tag: 'tr',
      })

      tableRow.appendChild(
        createElement({
          tag: 'th',
          text: client.id.slice(-6),
          attributes: [['scope', 'row']],
        }),
      )

      tableRow.appendChild(
        createElement({
          tag: 'td',
          text: `${client.surname} ${client.name} ${client.lastName}`,
        }),
      )

      tableRow.appendChild(this.createDateCell(client.createdAt))
      tableRow.appendChild(this.createDateCell(client.updatedAt))
      tableRow.appendChild(this.createContacts(client.contacts))

      this.tBody.appendChild(tableRow)
    })
  }

  async initClients() {
    this.clients = await getDataApi.getContacts()
  }

  createDateCell(str) {
    const newDate = new Date(str)

    const date = pudZero(newDate.getDate())
    const month =
      newDate.getMonth() + 1 > 12 ? '01' : pudZero(newDate.getMonth() + 1)
    const minutes = pudZero(newDate.getMinutes())

    return createElement({
      tag: 'td',
      html: `
      <span>${date}.${month}.${newDate.getFullYear()}</span>
      <span>${newDate.getHours()}:${minutes}</span>
    `,
    })
  }

  createContacts(contacts) {
    const contactCell = createElement({
      tag: 'td',
    })
    contacts.forEach((contact) => {
      let iconModifier = null
      switch (contact.type) {
        case 'Телефон':
          iconModifier = 'phone'
          break
        case 'Email':
          iconModifier = 'email'
          break
        case 'Facebook':
          iconModifier = 'facebook'
          break
        case 'VK':
          iconModifier = 'vk'
          break
        default:
          iconModifier = 'default'
          break
      }

      contactCell.appendChild(
        createElement({
          tag: 'div',
          classes: ['contact__icon', `contact__icon_${iconModifier}`],
        }),
      )
    })

    return contactCell
  }
}
