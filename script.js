let transactions = [
    { id: 1, date: '2026-01-15', category: 'Subscription', amount: -840, status: 'Success', type: 'expense' },
    { id: 2, date: '2026-01-10', category: 'Transfer', amount: -1240, status: 'Success', type: 'expense' },
    { id: 3, date: '2026-01-05', category: 'Transfer', amount: -1440, status: 'Success', type: 'expense' }
];

let monthlyIncome = 2645;
let monthlyExpenses = 1895;

const today = new Date().toISOString().split('T')[0];
document.getElementById('incomeDate').value = today;
document.getElementById('expenseDate').value = today;

function openIncomeModal() {
    document.getElementById('incomeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openExpenseModal() {
    document.getElementById('expenseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';

    if (modalId === 'incomeModal') {
        document.getElementById('incomeForm').reset();
        document.getElementById('incomeDate').value = today;
    } else {
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').value = today;
    }
}

window.onclick = function(event) {
    const incomeModal = document.getElementById('incomeModal');
    const expenseModal = document.getElementById('expenseModal');
    
    if (event.target === incomeModal) {
        closeModal('incomeModal');
    }
    if (event.target === expenseModal) {
        closeModal('expenseModal');
    }
}

function addIncome() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;
    const description = document.getElementById('incomeDescription').value;
    const date = document.getElementById('incomeDate').value;

    if (!amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }

    const newTransaction = {
        id: transactions.length + 1,
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: amount,
        status: 'Success',
        type: 'income',
        description: description
    };

    transactions.unshift(newTransaction);

    monthlyIncome += amount;
    updateDashboard();
    updateTransactionsTable();
    
    closeModal('incomeModal');
    
    showNotification('Income added successfully!', 'success');
}

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;
    const date = document.getElementById('expenseDate').value;

    if (!amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }

    const newTransaction = {
        id: transactions.length + 1,
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: -amount,
        status: 'Success',
        type: 'expense',
        description: description
    };

    transactions.unshift(newTransaction);
    
    monthlyExpenses += amount;
    updateDashboard();
    updateTransactionsTable();
    
    closeModal('expenseModal');
    
    showNotification('Expense added successfully!', 'success');
}

function updateDashboard() {
    document.querySelector('.income-amount').textContent = `₹${monthlyIncome.toLocaleString('en-IN')}.00`;
    document.querySelector('.expense-amount').textContent = `₹${monthlyExpenses.toLocaleString('en-IN')}.00`;
    
    const spendingLimit = 12645;
    const usedAmount = monthlyExpenses;
    const percentage = (usedAmount / spendingLimit) * 100;
    
    document.querySelector('.spending-limit').textContent = `₹${(spendingLimit - usedAmount).toLocaleString('en-IN')}.00`;
    document.querySelector('.progress-fill').style.width = `${Math.min(percentage, 100)}%`;
}

function updateTransactionsTable() {
    const tbody = document.querySelector('.transactions-table tbody');
    tbody.innerHTML = '';
    
    const recentTransactions = transactions.slice(0, 10);
    
    recentTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const amountDisplay = transaction.amount > 0 
            ? `+₹${transaction.amount.toLocaleString('en-IN')}.00`
            : `-₹${Math.abs(transaction.amount).toLocaleString('en-IN')}.00`;
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.category}</td>
            <td style="color: ${transaction.amount > 0 ? '#10b981' : '#ef4444'}">${amountDisplay}</td>
            <td><span class="status-success">${transaction.status}</span></td>
            <td><button class="action-btn"><i class="fas fa-ellipsis-h"></i></button></td>
        `;
        
        tbody.appendChild(row);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal('incomeModal');
        closeModal('expenseModal');
    }
    
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        openIncomeModal();
    }
    
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        openExpenseModal();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    updateTransactionsTable();
});