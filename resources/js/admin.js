import axios from 'axios' // Importing the axios library for making HTTP requests
import moment from 'moment' // Importing the moment library for date formatting
import Noty from 'noty' // Importing the Noty library for displaying notifications

// Function to initialize the admin page
export function initAdmin() {
  const orderTableBody = document.querySelector('#orderTableBody') // Selecting the table body element
  let orders = [] // Initializing an empty array for storing orders
  let markup // Variable to store the generated HTML markup

  // Making a GET request to '/admin/orders' endpoint
  axios.get('/admin/orders', {
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    }
  }).then(res => {
    orders = res.data // Storing the received orders in the 'orders' variable
    markup = generateMarkup(orders) // Generating HTML markup using the 'orders' data
    orderTableBody.innerHTML = markup // Updating the table body with the generated markup
  }).catch(err => {
    console.log(err) // Logging any errors that occur during the request
  })

  // Function to render the items of an order
  function renderItems(items) {
    let parsedItems = Object.values(items) // Converting the object values to an array
    return parsedItems.map((menuItem) => {
      return `
                <p>${menuItem.item.name} - ${menuItem.qty} pcs </p>
            `
    }).join('') // Joining the array elements into a string
  }


  // Function to generate the HTML markup for the orders
  function generateMarkup(orders) {
    return orders.map(order => {
      return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">${order.phone}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${order.status === 'order_placed' ? 'selected' : ''}>
                                    Placed</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>
                                    Confirmed</option>
                                <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>
                                    Prepared</option>
                                <option value="out for delivery" ${order.status === 'out for delivery' ? 'selected' : ''}>
                                    Out for Delivery
                                </option>
                                <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format('hh:mm A')}
                </td>
                <td class="border px-4 py-2">
                    ${order.paymentStatus ? 'paid' : 'Not paid'}
                </td>
            </tr>
        `
    }).join('')
  }
}