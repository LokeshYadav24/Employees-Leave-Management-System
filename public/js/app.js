class LeaveManagementApp {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('token');
        this.API_BASE = '/api';
        
        this.init();
    }

    async init() {
        // Check if user is already logged in
        if (this.token) {
            try {
                await this.loadUserProfile();
                this.setupNavigation();
                this.navigateTo('dashboard');
            } catch (error) {
                localStorage.removeItem('token');
                this.token = null;
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    }

    async apiRequest(endpoint, options = {}) {
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.API_BASE}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    showError(message, element) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    showSuccess(message) {
        // Create or update success message element
        let successElement = document.querySelector('.success-message');
        if (!successElement) {
            successElement = document.createElement('p');
            successElement.className = 'success-message';
            document.querySelector('#main-content').appendChild(successElement);
        }
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }

    showLogin() {
        const template = document.getElementById('login-template').innerHTML;
        document.getElementById('main-content').innerHTML = template;
        document.getElementById('main-nav').innerHTML = '';

        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorElement = document.querySelector('.error-message');

        try {
            const data = await this.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            this.token = data.token;
            this.currentUser = data.user;
            localStorage.setItem('token', this.token);

            this.setupNavigation();
            this.navigateTo('dashboard');
        } catch (error) {
            this.showError(error.message, errorElement);
        }
    }

    async loadUserProfile() {
        try {
            const data = await this.apiRequest('/auth/profile');
            this.currentUser = data;
        } catch (error) {
            throw error;
        }
    }

    setupNavigation() {
        const nav = document.getElementById('main-nav');
        let navHTML = '';

        if (['manager', 'admin'].includes(this.currentUser.role)) {
            navHTML = `
                <a href="#" onclick="app.navigateTo('dashboard')">Dashboard</a>
                <a href="#" onclick="app.navigateTo('all-requests')">All Requests</a>
                <a href="#" onclick="app.navigateTo('leave-calendar')">Calendar</a>
                <a href="#" onclick="app.navigateTo('employees')">Employees</a>
                <a href="#" onclick="app.logout()">Logout</a>
            `;
        } else {
            navHTML = `
                <a href="#" onclick="app.navigateTo('dashboard')">Dashboard</a>
                <a href="#" onclick="app.navigateTo('leave-request')">Request Leave</a>
                <a href="#" onclick="app.navigateTo('my-requests')">My Requests</a>
                <a href="#" onclick="app.navigateTo('leave-calendar')">Calendar</a>
                <a href="#" onclick="app.logout()">Logout</a>
            `;
        }

        nav.innerHTML = navHTML;
    }

    navigateTo(page) {
        switch (page) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'leave-request':
                this.showLeaveRequestForm();
                break;
            case 'my-requests':
                this.showMyRequests();
                break;
            case 'all-requests':
                this.showAllRequests();
                break;
            case 'leave-calendar':
                this.showLeaveCalendar();
                break;
            case 'employees':
                this.showEmployees();
                break;
            default:
                this.showDashboard();
        }
    }

    async showDashboard() {
        const templateId = ['manager', 'admin'].includes(this.currentUser.role) ? 'manager-dashboard-template' : 'dashboard-template';
        const template = document.getElementById(templateId).innerHTML;
        document.getElementById('main-content').innerHTML = template;

        if (['manager', 'admin'].includes(this.currentUser.role)) {
            document.getElementById('manager-name').textContent = this.currentUser.name;
            // Load manager dashboard stats
            try {
                const stats = await this.apiRequest('/dashboard/stats');
                // You can add dashboard stats display here
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            }
        } else {
            document.getElementById('user-name').textContent = this.currentUser.name;
            // Load employee leave balances
            try {
                const balances = await this.apiRequest('/users/leave-balances');
                const vacationBalance = balances.find(b => b.leave_type === 'Annual Leave');
                const sickBalance = balances.find(b => b.leave_type === 'Sick Leave');
                
                document.getElementById('vacation-balance').textContent = vacationBalance ? vacationBalance.remaining_days : '0';
                document.getElementById('sick-balance').textContent = sickBalance ? sickBalance.remaining_days : '0';
            } catch (error) {
                console.error('Failed to load leave balances:', error);
                document.getElementById('vacation-balance').textContent = '0';
                document.getElementById('sick-balance').textContent = '0';
            }
        }
    }

    async showLeaveRequestForm() {
        const template = document.getElementById('leave-request-template').innerHTML;
        document.getElementById('main-content').innerHTML = template;

        // Load leave types
        try {
            const leaveTypes = await this.apiRequest('/leaves/types');
            const select = document.getElementById('leave-type');
            leaveTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load leave types:', error);
        }

        // Initialize date pickers
        flatpickr("#start-date", {
            dateFormat: "Y-m-d",
            minDate: "today"
        });

        flatpickr("#end-date", {
            dateFormat: "Y-m-d",
            minDate: "today"
        });

        // Handle form submission
        const form = document.getElementById('leave-request-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLeaveRequest();
        });
    }

    async handleLeaveRequest() {
        const leaveTypeId = parseInt(document.getElementById('leave-type').value);
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const reason = document.getElementById('reason').value;
        const errorElement = document.querySelector('.error-message');

        try {
            await this.apiRequest('/leaves/request', {
                method: 'POST',
                body: JSON.stringify({ leaveTypeId, startDate, endDate, reason }),
            });

            this.showSuccess('Leave request submitted successfully!');
            this.navigateTo('my-requests');
        } catch (error) {
            this.showError(error.message, errorElement);
        }
    }

    async showMyRequests() {
        const template = document.getElementById('my-requests-template').innerHTML;
        document.getElementById('main-content').innerHTML = template;

        try {
            const requests = await this.apiRequest('/leaves/my-requests');
            this.renderRequests(requests, 'requests-list', false);
        } catch (error) {
            console.error('Failed to load requests:', error);
        }
    }

    async showAllRequests() {
        const template = document.getElementById('all-requests-template').innerHTML;
        document.getElementById('main-content').innerHTML = template;

        try {
            const requests = await this.apiRequest('/leaves/all-requests');
            this.renderRequests(requests, 'all-requests-list', true);
        } catch (error) {
            console.error('Failed to load all requests:', error);
        }
    }

    renderRequests(requests, containerId, showManagerActions) {
        const container = document.getElementById(containerId);
        
        if (requests.length === 0) {
            container.innerHTML = '<p>No leave requests found.</p>';
            return;
        }

        const requestsHTML = requests.map(request => {
            const statusClass = `status-${request.status}`;
            const requestClass = request.status;
            
            let managerActionsHTML = '';
            if (showManagerActions && request.status === 'pending') {
                managerActionsHTML = `
                    <div class="manager-actions">
                        <textarea id="comments-${request.id}" placeholder="Comments (optional)" class="comment-input"></textarea>
                        <button class="btn approve" onclick="app.processRequest(${request.id}, 'approve')">Approve</button>
                        <button class="btn reject" onclick="app.processRequest(${request.id}, 'reject')">Reject</button>
                    </div>
                `;
            }

            return `
                <div class="request-item ${requestClass}">
                    <div class="request-header">
                        <h4>${showManagerActions ? request.employeeName : 'Leave Request'}</h4>
                        <span class="status-badge ${statusClass}">${request.status}</span>
                    </div>
                    <div class="request-details">
                        <div>
                            <label>Leave Type:</label>
                            <span>${request.leaveType}</span>
                        </div>
                        <div>
                            <label>Start Date:</label>
                            <span>${new Date(request.startDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <label>End Date:</label>
                            <span>${new Date(request.endDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <label>Days:</label>
                            <span>${request.daysRequested}</span>
                        </div>
                    </div>
                    ${request.reason ? `<div><label>Reason:</label><p>${request.reason}</p></div>` : ''}
                    ${request.managerComments ? `<div><label>Manager Comments:</label><p>${request.managerComments}</p></div>` : ''}
                    ${managerActionsHTML}
                </div>
            `;
        }).join('');

        container.innerHTML = requestsHTML;
    }

    async processRequest(requestId, action) {
        const comments = document.getElementById(`comments-${requestId}`).value;

        try {
            await this.apiRequest(`/leaves/request/${requestId}`, {
                method: 'PUT',
                body: JSON.stringify({ action, comments }),
            });

            this.showSuccess(`Request ${action}d successfully!`);
            this.showAllRequests(); // Refresh the view
        } catch (error) {
            alert(`Failed to ${action} request: ${error.message}`);
        }
    }

    async showLeaveCalendar() {
        const template = document.getElementById('leave-calendar-template').innerHTML;
        document.getElementById('main-content').innerHTML = template;

        try {
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            
            const calendarData = await this.apiRequest(`/leaves/calendar?month=${month}&year=${year}`);
            this.renderCalendar(calendarData, year, month);
        } catch (error) {
            console.error('Failed to load calendar:', error);
        }
    }

    renderCalendar(leaveData, year, month) {
        const calendar = document.getElementById('calendar');
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDay = new Date(year, month - 1, 1).getDay();
        
        // Days of week headers
        const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let calendarHTML = headers.map(day => 
            `<div class="calendar-day-header">${day}</div>`
        ).join('');

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayLeaves = leaveData.filter(leave => {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                const current = new Date(dateStr);
                return current >= start && current <= end;
            });

            const leavesHTML = dayLeaves.map(leave => 
                `<div class="calendar-leave">${leave.employeeName} - ${leave.leaveType}</div>`
            ).join('');

            calendarHTML += `
                <div class="calendar-day">
                    <div class="day-number">${day}</div>
                    ${leavesHTML}
                </div>
            `;
        }

        calendar.innerHTML = calendarHTML;
    }

    async showEmployees() {
        const template = document.getElementById('employees-template').innerHTML;
        document.getElementById('main-content').innerHTML = template;

        try {
            const employees = await this.apiRequest('/auth/employees');
            this.renderEmployees(employees);
        } catch (error) {
            console.error('Failed to load employees:', error);
        }
    }

    renderEmployees(employees) {
        const container = document.getElementById('employees-list');
        
        const employeesHTML = employees.map(employee => `
            <div class="employee-item">
                <div>
                    <div class="employee-name">${employee.name}</div>
                    <div class="employee-role">${employee.employeeId}</div>
                </div>
                <div>Role: ${employee.role}</div>
                <div>Vacation: ${employee.vacationBalance} days</div>
                <div>Sick: ${employee.sickBalance} days</div>
            </div>
        `).join('');

        container.innerHTML = employeesHTML;
    }

    logout() {
        localStorage.removeItem('token');
        this.token = null;
        this.currentUser = null;
        this.showLogin();
    }
}

// Initialize the app
const app = new LeaveManagementApp();
