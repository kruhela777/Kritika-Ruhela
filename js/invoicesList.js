// Load invoices from localStorage and display them
function loadInvoices() {
  const invoiceList = document.getElementById('invoiceList');
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');

  if (invoices.length === 0) {
    invoiceList.innerHTML = '<p>No saved invoices found.</p>';
    return;
  }

  invoiceList.innerHTML = '';

  invoices.forEach(inv => {
    const card = document.createElement('div');
    card.className = 'invoice-card';

    card.innerHTML = `
      <div class="invoice-title">${inv.title || 'Untitled Invoice'}</div>
      <div class="invoice-meta">
        <div><strong>Invoice No:</strong> ${inv.invoiceNo || '-'}</div>
        <div><strong>Date:</strong> ${inv.date || '-'}</div>
      </div>
      <div class="invoice-total">Grand Total: $${inv.grandTotal.toFixed(2)}</div>
    `;

    // Optional: click to open preview of this invoice in new window/tab
    card.addEventListener('click', () => {
      openInvoicePreview(inv);
    });

    invoiceList.appendChild(card);
  });
}

function openInvoicePreview(data) {
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
}

window.addEventListener('DOMContentLoaded', loadInvoices);
