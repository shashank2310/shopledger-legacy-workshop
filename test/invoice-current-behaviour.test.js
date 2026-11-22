const { test } = require('node:test');
const assert = require('node:assert/strict');
const pricing = require('../lib/pricing');
const invoice = require('../lib/invoice');

test('CURRENT BEHAVIOUR: order and invoice totals match for normal order lines', () => {
  const items = [
    { id: 1, name: 'Rice', sku: 'R1', hsn: '1006', price: 100, qty: 2 },
    { id: 2, name: 'Tea', sku: 'T1', hsn: '0902', price: 50, qty: 1 }
  ];
  const billed = pricing.computeTotals(items, '');
  const order = { items, coupon: '', subtotal: billed.subtotal, discount: billed.discount, tax: billed.tax, total: billed.total };
  const figures = invoice.computeInvoiceFigures(order);
  assert.equal(figures.subtotal, 250);
  assert.equal(figures.tax, 19);
  assert.equal(figures.cgst, 9.5);
  assert.equal(figures.sgst, 9.5);
  assert.equal(figures.total, billed.total);
});

test('invoice line gross reflects its apportioned coupon discount', () => {
  const items = [{ id: 1, name: 'Rice', sku: 'R1', hsn: '1006', price: 500, qty: 1 }];
  const billed = pricing.computeTotals(items, 'SAVE10');
  const order = { items, coupon: 'SAVE10', total: billed.total };
  const figures = invoice.computeInvoiceFigures(order);
  assert.equal(billed.discount, 50);
  assert.equal(billed.tax, 22.5);
  assert.equal(figures.total, billed.total);
  assert.equal(figures.rows[0].line, 450);
  assert.equal(figures.rows[0].lineTax, 22.5);
  assert.equal(figures.rows[0].line + figures.rows[0].lineTax, figures.total);
  assert.equal(figures.total, 472.5);
});

test('CURRENT BEHAVIOUR: mismatched ledger total is shown as a reconciliation notice', () => {
  const order = { id: 42, date: '2026-01-01', customer: 'Test', items: [{ name: 'Tea', price: 100, qty: 1, hsn: '0902' }], total: 100 };
  const html = invoice.render(order);
  assert.match(html, /Invoice computed total/);
  assert.match(html, /differs from Order Ledger recorded total/);
});

