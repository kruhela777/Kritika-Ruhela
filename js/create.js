// Utility to gather invoice data
function getInvoiceData() {
  // Get invoice title
  const title = document.getElementById('invoiceTitle').value;

  // From section inputs (assume 4 inputs inside first .column)
  const fromInputs = document.querySelectorAll('.invoice-section .column:nth-child(1) input');
  const from = {
    businessName: fromInputs[0].value,
    email: fromInputs[1].value,
    street: fromInputs[2].value,
    phone: fromInputs[3].value,
  };

  // Bill To section inputs (assume 4 inputs inside second .column)
  const billToInputs = document.querySelectorAll('.invoice-section .column:nth-child(2) input');
  const billTo = {
    clientName: billToInputs[0].value,
    email: billToInputs[1].value,
    street: billToInputs[2].value,
    phone: billToInputs[3].value,
  };

  // Invoice items
  const rows = document.querySelectorAll('#invoiceBody tr');
  const items = [];
  rows.forEach(row => {
    items.push({
      description: row.querySelector('.desc').value,
      price: parseFloat(row.querySelector('.price').value) || 0,
      quantity: parseFloat(row.querySelector('.qty').value) || 0,
      total: parseFloat(row.querySelector('.row-total').value) || 0,
    });
  });

  // Metadata
  const invoiceNo = document.getElementById('invoiceNo').value;
  const accountNo = document.getElementById('accountNo').value;
  const date = document.getElementById('invoiceDate').value;
  const notes = document.getElementById('invoiceNotes').value;
  const taxPercent = parseFloat(document.getElementById('taxInput').value) || 0;
  const subtotal = parseFloat(document.getElementById('subTotal').innerText) || 0;
  const totalQty = parseFloat(document.getElementById('totalQty').innerText) || 0;
  const grandTotal = parseFloat(document.getElementById('grandTotal').innerText) || 0;

  return {
    title, from, billTo, items,
    invoiceNo, accountNo, date, notes,
    taxPercent, subtotal, totalQty, grandTotal
  };
}

// Save invoice to localStorage
document.getElementById('saveInvoiceBtn').addEventListener('click', () => {
  const invoiceData = getInvoiceData();

  // Get existing invoices array from localStorage
  let invoices = JSON.parse(localStorage.getItem('invoicesList')) || [];

  // Push new invoice to the array
  invoices.push(invoiceData);

  // Save updated array back to localStorage
  localStorage.setItem('invoicesList', JSON.stringify(invoices));

  // Redirect to invoices list page
  window.location.href = 'invoicesList.html'; // Or the actual file name you choose
});



// Preview invoice from saved data
document.getElementById('previewBtn').addEventListener('click', () => {
  const data = getInvoiceData();

  // Open preview window and build HTML (same as before)
  const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');

  const html = `
    <html>
    <head>
      <title>Invoice Preview</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #f9aa33; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
        .header-section, .footer-section { margin-top: 20px; }
        .right-align { text-align: right; }
      </style>
    </head>
    <body>
      <h1>${data.title || 'Invoice'}</h1>
      <div class="header-section">
        <strong>Invoice No:</strong> ${data.invoiceNo || '-'}<br/>
        <strong>Account No:</strong> ${data.accountNo || '-'}<br/>
        <strong>Date:</strong> ${data.date || '-'}
      </div>

      <div style="display:flex; gap: 40px; margin-top: 20px;">
        <div>
          <h3>From:</h3>
          <p>
            ${data.from.businessName}<br/>
            ${data.from.email}<br/>
            ${data.from.street}<br/>
            ${data.from.phone}
          </p>
        </div>
        <div>
          <h3>Bill To:</h3>
          <p>
            ${data.billTo.clientName}<br/>
            ${data.billTo.email}<br/>
            ${data.billTo.street}<br/>
            ${data.billTo.phone}
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="right-align">Price</th>
            <th class="right-align">Quantity</th>
            <th class="right-align">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${item.description || '-'}</td>
              <td class="right-align">${item.price.toFixed(2)}</td>
              <td class="right-align">${item.quantity.toFixed(2)}</td>
              <td class="right-align">${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer-section" style="margin-top: 20px;">
        <p><strong>Total Quantity:</strong> ${data.totalQty.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
        <p><strong>Tax (${data.taxPercent}%):</strong> $${(data.subtotal * data.taxPercent / 100).toFixed(2)}</p>
        <h3>Grand Total: $${data.grandTotal.toFixed(2)}</h3>
      </div>

      <div class="notes" style="margin-top: 30px;">
        <h3>Notes</h3>
        <p>${data.notes || '-'}</p>
      </div>
    </body>
    </html>
  `;

  previewWindow.document.write(html);
  previewWindow.document.close();
});

