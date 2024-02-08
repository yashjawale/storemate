const addItemButton = document.getElementById('add-item-button')
const proceedButton = document.getElementById('proceed-button')
const addItemCode = document.getElementById('add-item-code')
const orderContainer = document.getElementById('item-container')
const orderTotal = document.getElementById('order-total')

addItemButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let code = addItemCode.value
    // console.log(code)
    let response = await fetch('/getitem?id=' + code)
    let items = await response.json()
    let item = items[0]
    console.log(items[0])
    orderContainer.innerHTML += `<tr class="list-item">
    <td class="list-item-code">${item.item_code}</td>
    <td class="list-item-name">${item.item_name}</td>
    <td>$ <span class="list-item-price">${item.item_price}</span></td>
    <td>
        <input class="list-item-quantity" style="width: 60px;" type="number" min="1" value="1" max=${item.item_quantity} onChange="updateList()">
    </td>
    <td>$ <span class="list-item-total">0</span></td>
    <td><span class="material-symbols-outlined trash-icon" onClick="deleteItem(event)">delete</span></td>
    </tr>`
    updateList()
})

proceedButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let newOrder = {}
    newOrder.items = []
    newOrder.totalAmount = orderTotal.innerText
    newOrder.customerName = document.getElementById('customer-name').value
    newOrder.customerMobile = document.getElementById('customer-mobile').value
    while (orderContainer.firstElementChild) {
        let currentItem = orderContainer.firstElementChild
        newOrder.items.push({
            itemCode: currentItem.getElementsByClassName('list-item-code')[0].innerText,
            quantity: currentItem.getElementsByClassName('list-item-quantity')[0].value
        })
        orderContainer.removeChild(orderContainer.firstElementChild)
    }
    console.log(newOrder)
    // Make fetch api call to flask to store a bill entry and add items to sold ledger
    let response = await fetch('/addorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder),
        redirect: 'follow'
    }).then(res => {
        console.log(res)
        if (res.redirected) {
            window.location.href = res.url;
        }
    })
})

function updateList() {
    let rows = orderContainer.getElementsByClassName('list-item')
    let total = 0
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        let price = parseFloat(row.getElementsByClassName('list-item-price')[0].innerText)
        let quantity = parseInt(row.getElementsByClassName('list-item-quantity')[0].value)
        row.getElementsByClassName('list-item-total')[0].innerText = price * quantity
        total += price * quantity
    }
    orderTotal.innerText = total.toFixed(2)
}

function deleteItem(e) {
    console.log("DELETED")
    e.currentTarget.parentElement.parentElement.remove()
    updateList()
}
