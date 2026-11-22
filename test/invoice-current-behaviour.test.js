const { test } = require('node:test');
const assert = require('node:assert/strict');
const pricing = require('../lib/pricing');
const invoice = require('../lib/invoice');

test('CURRENT BEHAVIOUR: billing and invoice totals match for ordinary lines', () => {
  const items = [
    { id: 1, name: 'Rice', sku: 'R1', hsn: '1006', price: 100, qty: 2 },
    { id: 2, name: 'Tea', sku: 'T1', hsn: '0902', price: 50, qty: 1 }
  ];
  const billed = pricing.computeTotals(items, '');
  const figures = invoice.computeInvoiceFigures({
    items, coupon: '', total: billed.total
  });

  assert.equal(figures.subtotal, 250);
  assert.equal(figures.tax, 19);
  assert.equal(figures.cgst, 9.5);
  assert.equal(figures.sgst, 9.5);
  assert.equal(figures.total, billed.total);
});

test('CURRENT BEHAVIOUR: coupon changes billed total but invoice line gross stays undiscounted', () => {
  const items = [{ id: 1, name: 'Rice', sku: 'R1', hsn: '1006', price: 500, qty: 1 }];
  const billed = pricing.computeTotals(items, 'SAVE10');
  const order = { id: 43, date: '2026-01-01', items, coupon: 'SAVE10', total: billed.total };
  const figures = invoice.computeInvoiceFigures(order);
  const html = invoice.render(order);

  assert.equal(billed.discount, 50);
  assert.equal(billed.tax, 22.5);
  assert.equal(figures.total, billed.total);
  assert.equal(figures.rows[0].line, 500);
  assert.equal(figures.rows[0].lineTax, 22.5);
  assert.equal(figures.rows[0].line + figures.rows[0].lineTax, 522.5);
  assert.equal(figures.total, 472.5);
  assert.match(html, /₹500\.00/);
  assert.match(html, /₹472\.50/);
});

test('CURRENT BEHAVIOUR: invoice renders reconciliation notice when ledger total differs', () => {
  const order = {
    id: 42, date: '2026-01-01', customer: 'Test',
    items: [{ name: 'Tea', price: 100, qty: 1, hsn: '0902' }],
    total: 100
  };

  const html = invoice.render(order);
  assert.match(html, /Invoice computed total/);
  assert.match(html, /differs from Order Ledger recorded total/);
});
