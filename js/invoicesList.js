document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('invoiceTableBody');
  const invoices = JSON.parse(localStorage.getItem('invoicesList')) || [];

  if (invoices.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No invoices found.</td></tr>';
    return;
  }

  invoices.forEach((invoice, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${invoice.invoiceNo || '-'}</td>
      <td>${invoice.billTo?.clientName || '-'}</td>
      <td>${invoice.date || '-'}</td>
      <td>$${invoice.grandTotal.toFixed(2)}</td>
      <td>
        <button onclick="previewInvoice(${index})">Preview</button>
        <button onclick="downloadInvoice(${index})">Download</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
});

function previewInvoice(index) {
  const invoices = JSON.parse(localStorage.getItem('invoicesList')) || [];
  const data = invoices[index];
  if (!data) return;

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
        <strong>Invoice No:</strong> ${data.invoiceNo}<br/>
        <strong>Account No:</strong> ${data.accountNo}<br/>
        <strong>Date:</strong> ${data.date}
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
              <td>${item.description}</td>
              <td class="right-align">${item.price.toFixed(2)}</td>
              <td class="right-align">${item.quantity.toFixed(2)}</td>
              <td class="right-align">${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer-section">
        <p><strong>Total Quantity:</strong> ${data.totalQty.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
        <p><strong>Tax (${data.taxPercent}%):</strong> $${(data.subtotal * data.taxPercent / 100).toFixed(2)}</p>
        <h3>Grand Total: $${data.grandTotal.toFixed(2)}</h3>
      </div>

      <div class="notes">
        <h3>Notes</h3>
        <p>${data.notes}</p>
      </div>
    </body>
    </html>
  `;

  previewWindow.document.write(html);
  previewWindow.document.close();
}

function downloadInvoice(index) {
  const invoices = JSON.parse(localStorage.getItem('invoicesList')) || [];
  const data = invoices[index];
  if (!data) return;

  const html = `
    <html>
    <head>
      <title>Invoice - ${data.invoiceNo}</title>
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
        <strong>Invoice No:</strong> ${data.invoiceNo}<br/>
        <strong>Account No:</strong> ${data.accountNo}<br/>
        <strong>Date:</strong> ${data.date}
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
              <td>${item.description}</td>
              <td class="right-align">${item.price.toFixed(2)}</td>
              <td class="right-align">${item.quantity.toFixed(2)}</td>
              <td class="right-align">${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer-section">
        <p><strong>Total Quantity:</strong> ${data.totalQty.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
        <p><strong>Tax (${data.taxPercent}%):</strong> $${(data.subtotal * data.taxPercent / 100).toFixed(2)}</p>
        <h3>Grand Total: $${data.grandTotal.toFixed(2)}</h3>
      </div>

      <div class="notes">
        <h3>Notes</h3>
        <p>${data.notes}</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${data.invoiceNo || index + 1}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
