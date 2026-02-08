// ===== API CONFIGURATION =====
const API_BASE_URL = 'https://mockbankapi.example.com'; // Replace with actual API URL
const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api?action=login`,
    TRANSACTIONS: `${API_BASE_URL}/api?action=transactions`
};

// ===== LOCAL STORAGE KEYS =====
const STORAGE_KEYS = {
    USER_DATA: 'miniBankUserData',
    ACCOUNT_NUMBER: 'miniBankAccountNumber',
    REMEMBER_ME: 'miniBankRememberMe'
};

// ===== GLOBAL STATE =====
let currentUser = null;
let transactions = [];

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.querySelector('#errorText').textContent = message;
        errorElement.classList.remove('hidden');
        
        // Auto hide error after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.toggle('hidden', !show);
    }
}

// ===== API FUNCTIONS =====
async function loginUser(accountNumber, password) {
    try {
        // In a real app, this would be an actual API call
        // For demo purposes, we're simulating API response
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock user data - in real app this would come from API
        const mockUsers = {
            '1234567890': {
                success: true,
                accountNumber: '1234567890',
                customerName: 'Rahul Sharma',
                balance: 125450.75,
                mobile: '+91 9876543210',
                email: 'rahul.sharma@email.com',
                accountType: 'Savings Account'
            },
            '9876543210': {
                success: true,
                accountNumber: '9876543210',
                customerName: 'Priya Patel',
                balance: 89320.50,
                mobile: '+91 8765432109',
                email: 'priya.patel@email.com',
                accountType: 'Current Account'
            }
        };
        
        if (mockUsers[accountNumber] && password === (accountNumber === '1234567890' ? 'demo123' : 'test456')) {
            return {
                success: true,
                data: mockUsers[accountNumber]
            };
        }
        
        return {
            success: false,
            error: 'Invalid account number or password'
        };
        
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Network error. Please try again.'
        };
    }
}

async function fetchTransactions(accountNumber) {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock transaction data
        const mockTransactions = [
            {
                id: 1,
                date: '2023-10-15',
                description: 'Salary Credit',
                reference: 'SAL20231015',
                amount: 75000.00,
                type: 'credit',
                status: 'completed'
            },
            {
                id: 2,
                date: '2023-10-12',
                description: 'ATM Withdrawal',
                reference: 'ATM456789',
                amount: 5000.00,
                type: 'debit',
                status: 'completed'
            },
            {
                id: 3,
                date: '2023-10-10',
                description: 'Electricity Bill',
                reference: 'EB789012',
                amount: 2450.00,
                type: 'debit',
                status: 'completed'
            },
            {
                id: 4,
                date: '2023-10-08',
                description: 'Fund Transfer to Ajay',
                reference: 'FT345678',
                amount: 15000.00,
                type: 'debit',
                status: 'completed'
            },
            {
                id: 5,
                date: '2023-10-05',
                description: 'Interest Credit',
                reference: 'INT20231005',
                amount: 1250.50,
                type: 'credit',
                status: 'completed'
            },
            {
                id: 6,
                date: '2023-10-01',
                description: 'Credit Card Payment',
                reference: 'CC789123',
                amount: 18450.00,
                type: 'debit',
                status: 'pending'
            },
            {
                id: 7,
                date: '2023-09-28',
                description: 'Mobile Recharge',
                reference: 'MR456123',
                amount: 599.00,
                type: 'debit',
                status: 'completed'
            }
        ];
        
        return {
            success: true,
            data: mockTransactions
        };
        
    } catch (error) {
        console.error('Fetch transactions error:', error);
        return {
            success: false,
            error: 'Failed to load transactions'
        };
    }
}

// ===== LOGIN PAGE LOGIC =====
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm) return; // Not on login page
    
    // Load saved credentials if "Remember me" was checked
    const savedAccount = localStorage.getItem(STORAGE_KEYS.ACCOUNT_NUMBER);
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    
    if (savedAccount && rememberMe) {
        document.getElementById('accountNumber').value = savedAccount;
        rememberMeCheckbox.checked = true;
    }
    
    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const accountNumber = document.getElementById('accountNumber').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        if (!accountNumber || !password) {
            showError('errorMessage', 'Please enter both account number and password');
            return;
        }
        
        if (!/^\d{10}$/.test(accountNumber)) {
            showError('errorMessage', 'Please enter a valid 10-digit account number');
            return;
        }
        
        // Update button state
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        loginBtn.disabled = true;
        
        // Call login API
        const result = await loginUser(accountNumber, password);
        
        if (result.success) {
            // Save to localStorage
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.data));
            
            if (rememberMe) {
                localStorage.setItem(STORAGE_KEYS.ACCOUNT_NUMBER, accountNumber);
                localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
            } else {
                localStorage.removeItem(STORAGE_KEYS.ACCOUNT_NUMBER);
                localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
            }
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error
            showError('errorMessage', result.error || 'Login failed. Please try again.');
            
            // Reset button
            loginBtn.innerHTML = '<span>Secure Login</span><i class="fas fa-arrow-right"></i>';
            loginBtn.disabled = false;
        }
    });
}

// ===== DASHBOARD PAGE LOGIC =====
function initDashboardPage() {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA));
    
    if (!userData) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = userData;
    
    // Load user data
    loadUserData();
    
    // Load transactions
    loadTransactions();
    
    // Setup event listeners
    setupDashboardEventListeners();
}

function loadUserData() {
    if (!currentUser) return;
    
    // Update user info in navbar
    document.getElementById('userName').textContent = currentUser.customerName;
    document.getElementById('userAccount').textContent = `Account: ${currentUser.accountNumber}`;
    
    // Update customer info card
    document.getElementById('customerName').textContent = currentUser.customerName;
    document.getElementById('customerAccount').textContent = currentUser.accountNumber;
    document.getElementById('customerMobile').textContent = currentUser.mobile;
    document.getElementById('customerEmail').textContent = currentUser.email;
    
    // Update balance
    document.getElementById('balanceAmount').textContent = formatCurrency(currentUser.balance);
    document.getElementById('accountType').textContent = currentUser.accountType;
}

async function loadTransactions() {
    if (!currentUser) return;
    
    const transactionsLoading = document.getElementById('transactionsLoading');
    const emptyState = document.getElementById('emptyState');
    const transactionsBody = document.getElementById('transactionsBody');
    
    // Show loading state
    if (transactionsLoading) transactionsLoading.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    if (transactionsBody) transactionsBody.innerHTML = '';
    
    // Fetch transactions
    const result = await fetchTransactions(currentUser.accountNumber);
    
    // Hide loading state
    if (transactionsLoading) transactionsLoading.classList.add('hidden');
    
    if (result.success && result.data && result.data.length > 0) {
        transactions = result.data;
        renderTransactions(transactions);
        updateTransactionSummary();
    } else {
        // Show empty state
        if (emptyState) emptyState.classList.remove('hidden');
    }
}

function renderTransactions(transactionsToRender) {
    const transactionsBody = document.getElementById('transactionsBody');
    const emptyState = document.getElementById('emptyState');
    
    if (!transactionsBody) return;
    
    if (!transactionsToRender || transactionsToRender.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        transactionsBody.innerHTML = '';
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    let html = '';
    
    transactionsToRender.forEach(transaction => {
        const amountClass = transaction.type === 'credit' ? 'transaction-credit' : 'transaction-debit';
        const amountSign = transaction.type === 'credit' ? '+' : '-';
        const statusClass = `status-${transaction.status}`;
        
        html += `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.description}</td>
                <td>${transaction.reference}</td>
                <td class="amount-col ${amountClass}">
                    ${amountSign}${formatCurrency(transaction.amount)}
                </td>
                <td>
                    <span class="transaction-status ${statusClass}">
                        ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                </td>
            </tr>
        `;
    });
    
    transactionsBody.innerHTML = html;
}

function updateTransactionSummary() {
    const transactionCount = document.getElementById('transactionCount');
    if (transactionCount) {
        transactionCount.textContent = transactions.length;
    }
}

function filterTransactions(filterType) {
    let filtered = [...transactions];
    
    switch (filterType) {
        case 'credit':
            filtered = transactions.filter(t => t.type === 'credit');
            break;
        case 'debit':
            filtered = transactions.filter(t => t.type === 'debit');
            break;
        case 'last7':
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filtered = transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
            break;
        default:
            // 'all' - show all transactions
            break;
    }
    
    renderTransactions(filtered);
}

function setupDashboardEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear localStorage
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            
            // Redirect to login
            window.location.href = 'index.html';
        });
    }
    
    // Transaction filter
    const transactionFilter = document.getElementById('transactionFilter');
    if (transactionFilter) {
        transactionFilter.addEventListener('change', (e) => {
            filterTransactions(e.target.value);
        });
    }
    
    // View all transactions button
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            // Reset filter to show all
            if (transactionFilter) {
                transactionFilter.value = 'all';
                filterTransactions('all');
            }
            
            // Scroll to transactions table
            document.querySelector('.transactions-card').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.querySelector('span').textContent;
            alert(`"${action}" feature would be implemented in a real banking application.`);
        });
    });
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on and initialize accordingly
    if (document.getElementById('loginForm')) {
        initLoginPage();
    } else if (document.getElementById('loadingOverlay')) {
        // Show loading overlay initially
        showLoading(true);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            initDashboardPage();
            showLoading(false);
        }, 800);
    }
});
