export function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
