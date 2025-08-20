// Hospital Management System - Main Application
class HospitalManagementSystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.patients = [];
        this.doctors = [];
        this.appointments = [];
        this.billing = [];
        this.editingId = null;
        
        document.addEventListener("DOMContentLoaded", () => this.init());
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.setupTheme();
    }

    // ---------------- Data Management ----------------
    loadData() {
        this.patients = JSON.parse(localStorage.getItem('patients')) || this.getSamplePatients();
        this.doctors = JSON.parse(localStorage.getItem('doctors')) || this.getSampleDoctors();
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || this.getSampleAppointments();
        this.billing = JSON.parse(localStorage.getItem('billing')) || this.getSampleBilling();
        this.saveData();
    }

    saveData() {
        localStorage.setItem('patients', JSON.stringify(this.patients));
        localStorage.setItem('doctors', JSON.stringify(this.doctors));
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
        localStorage.setItem('billing', JSON.stringify(this.billing));
    }

    // ---------------- Sample Data ----------------
    getSamplePatients() {
        return [
            { id: 1, name: 'John Doe', age: 35, gender: 'Male', contact: '+1-555-0123', condition: 'Cardiology', lastVisit: '2024-01-10' },
            { id: 2, name: 'Jane Smith', age: 28, gender: 'Female', contact: '+1-555-0124', condition: 'Neurology', lastVisit: '2024-01-12' },
            { id: 3, name: 'Mike Johnson', age: 42, gender: 'Male', contact: '+1-555-0125', condition: 'Orthopedics', lastVisit: '2024-01-14' }
        ];
    }

    getSampleDoctors() {
        return [
            { id: 1, name: 'Dr. Emily Davis', specialization: 'Cardiology', availability: 'Available', rating: 4.8 },
            { id: 2, name: 'Dr. Robert Wilson', specialization: 'Neurology', availability: 'Busy', rating: 4.9 },
            { id: 3, name: 'Dr. Michael Chen', specialization: 'General Medicine', availability: 'On Leave', rating: 4.6 }
        ];
    }

    getSampleAppointments() {
        return [
            { id: 1, patientId: 1, doctorId: 1, date: '2024-01-15', time: '09:00', status: 'Confirmed' },
            { id: 2, patientId: 2, doctorId: 2, date: '2024-01-15', time: '10:30', status: 'Pending' }
        ];
    }

    getSampleBilling() {
        return [
            { id: 1, patientId: 1, services: 'Cardiac Consultation', amount: 150, status: 'Paid', date: '2024-01-15' },
            { id: 2, patientId: 2, services: 'Neurological Exam', amount: 200, status: 'Pending', date: '2024-01-16' }
        ];
    }

    // ---------------- Event Listeners ----------------
    setupEventListeners() {
        document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('a').dataset.page;
                this.navigateToPage(page);
            });
        });

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Patient
        document.getElementById('addPatientBtn').addEventListener('click', () => this.openPatientModal());
        document.getElementById('patientForm').addEventListener('submit', (e) => { e.preventDefault(); this.savePatient(); });
        document.getElementById('patientModalClose').addEventListener('click', () => this.closePatientModal());
        document.getElementById('patientModalCancel').addEventListener('click', () => this.closePatientModal());

        // Doctor
        document.getElementById('addDoctorBtn').addEventListener('click', () => this.openDoctorModal());
        document.getElementById('doctorForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveDoctor(); });
        document.getElementById('doctorModalClose').addEventListener('click', () => this.closeDoctorModal());
        document.getElementById('doctorModalCancel').addEventListener('click', () => this.closeDoctorModal());

        // Appointment
        document.getElementById('addAppointmentBtn').addEventListener('click', () => this.openAppointmentModal());
        document.getElementById('appointmentForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveAppointment(); });

        // Billing
        document.getElementById('addBillingBtn').addEventListener('click', () => this.openBillingModal());
        document.getElementById('billingForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveBilling(); });

        // Filters
        document.getElementById('patientSearch').addEventListener('input', () => this.filterPatients());
        document.getElementById('genderFilter').addEventListener('change', () => this.filterPatients());
        document.getElementById('conditionFilter').addEventListener('change', () => this.filterPatients());
        document.getElementById('ageFilter').addEventListener('change', () => this.filterPatients());

        document.getElementById('doctorSearch').addEventListener('input', () => this.filterDoctors());
        document.getElementById('specializationFilter').addEventListener('change', () => this.filterDoctors());
        document.getElementById('availabilityFilter').addEventListener('change', () => this.filterDoctors());
    }

    // ---------------- Navigation ----------------
    navigateToPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(page);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll(`[data-page="${page}"]`).forEach(link => link.classList.add('active'));

        this.currentPage = page;

        // Render page-specific content
        switch(page) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'patients':
                this.renderPatients();
                break;
            case 'doctors':
                this.renderDoctors();
                break;
            case 'appointments':
                this.renderAppointments();
                break;
            case 'billing':
                this.renderBilling();
                break;
            case 'reports':
                this.renderReports();
                break;
        }
    }

    // ---------------- Theme ----------------
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (!icon) return;
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ---------------- Dashboard ----------------
    renderDashboard() {
        this.updateDashboardStats();
        this.renderUpcomingAppointments();
        this.renderRecentPatients();
        this.updateStatChanges();
    }

    updateDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.appointments.filter(a => a.date === today);

        document.getElementById('totalPatients').textContent = this.patients.length;
        document.getElementById('totalDoctors').textContent = this.doctors.length;
        document.getElementById('todayAppointments').textContent = todayAppointments.length;

        const totalRevenue = this.billing.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    }

    updateStatChanges() {
        // Simulate percentage changes for stats
        const changes = document.querySelectorAll('.stat-change');
        changes.forEach((change, index) => {
            const percentages = ['+12%', '+8%', '+15%', '+22%'];
            change.textContent = percentages[index] || '+0%';
            change.className = 'stat-change positive';
        });
    }

    renderUpcomingAppointments() {
        const container = document.getElementById('appointmentsPreview');
        if (!container) return;

        const upcoming = this.appointments
            .filter(a => a.status === 'Confirmed' || a.status === 'Pending')
            .slice(0, 3);

        if (upcoming.length === 0) {
            container.innerHTML = '<div class="no-data">No upcoming appointments</div>';
            return;
        }

        container.innerHTML = upcoming.map(a => {
            const patient = this.patients.find(p => p.id === a.patientId);
            const doctor = this.doctors.find(d => d.id === a.doctorId);
            return `
                <div class="appointment-preview-item">
                    <div class="appointment-time">${a.time}</div>
                    <div class="appointment-details">
                        <div class="patient-name">${patient ? patient.name : 'Unknown'}</div>
                        <div class="doctor-name">${doctor ? doctor.name : 'Unknown'}</div>
                    </div>
                    <div class="appointment-status ${a.status.toLowerCase()}">${a.status}</div>
                </div>
            `;
        }).join('');
    }

    renderRecentPatients() {
        const container = document.getElementById('patientsPreview');
        if (!container) return;

        const recent = this.patients.slice(-3).reverse();

        if (recent.length === 0) {
            container.innerHTML = '<div class="no-data">No patients added yet</div>';
            return;
        }

        container.innerHTML = recent.map(p => `
            <div class="patient-preview-item">
                <div class="patient-avatar">${p.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="patient-details">
                    <div class="patient-name">${p.name}</div>
                    <div class="patient-condition">${p.condition}</div>
                </div>
                <div class="patient-age">${p.age} yrs</div>
            </div>
        `).join('');
    }

    // ---------------- Patients ----------------
    renderPatients() {
        this.renderPatientsTable();
        this.populatePatientSelects();
    }

    renderPatientsTable(list = this.patients) {
        const tbody = document.getElementById('patientsTableBody');
        if (!tbody) return;

        tbody.innerHTML = list.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.contact}</td>
                <td>${p.condition}</td>
                <td>${p.lastVisit || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="hms.editPatient(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="hms.deletePatient(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    savePatient() {
        const name = document.getElementById('patientName').value;
        const age = parseInt(document.getElementById('patientAge').value);
        const gender = document.getElementById('patientGender').value;
        const contact = document.getElementById('patientContact').value;
        const condition = document.getElementById('patientCondition').value;

        if (!name || !age || !gender || !contact || !condition) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        if (this.editingId) {
            const idx = this.patients.findIndex(p => p.id === this.editingId);
            this.patients[idx] = { ...this.patients[idx], name, age, gender, contact, condition };
            this.showToast('Patient updated successfully', 'success');
        } else {
            const id = Math.max(...this.patients.map(p => p.id), 0) + 1;
            this.patients.push({ id, name, age, gender, contact, condition, lastVisit: new Date().toISOString().split('T')[0] });
            this.showToast('Patient added successfully', 'success');
        }

        this.saveData();
        this.closePatientModal();
        this.renderPatients();
        this.updateDashboardStats();
    }

    openPatientModal(patient = null) {
        document.getElementById('patientModal').classList.add('active');
        this.editingId = patient ? patient.id : null;
        if (patient) {
            document.getElementById('patientName').value = patient.name;
            document.getElementById('patientAge').value = patient.age;
            document.getElementById('patientGender').value = patient.gender;
            document.getElementById('patientContact').value = patient.contact;
            document.getElementById('patientCondition').value = patient.condition;
        } else {
            document.getElementById('patientForm').reset();
        }
    }

    closePatientModal() {
        document.getElementById('patientModal').classList.remove('active');
        this.editingId = null;
    }

    editPatient(id) {
        const patient = this.patients.find(p => p.id === id);
        if (patient) this.openPatientModal(patient);
    }

    deletePatient(id) {
        if (confirm('Are you sure you want to delete this patient?')) {
            this.patients = this.patients.filter(p => p.id !== id);
            this.saveData();
            this.renderPatients();
            this.updateDashboardStats();
            this.showToast('Patient deleted successfully', 'success');
        }
    }

    filterPatients() {
        const search = document.getElementById('patientSearch').value.toLowerCase();
        const gender = document.getElementById('genderFilter').value;
        const condition = document.getElementById('conditionFilter').value;
        const ageFilter = document.getElementById('ageFilter').value;

        let filteredPatients = this.patients.filter(p =>
            (p.name.toLowerCase().includes(search) || p.contact.includes(search)) &&
            (!gender || p.gender === gender) &&
            (!condition || p.condition === condition)
        );

        if (ageFilter) {
            filteredPatients = filteredPatients.filter(p => {
                if (ageFilter === '0-18') return p.age <= 18;
                if (ageFilter === '19-30') return p.age >= 19 && p.age <= 30;
                if (ageFilter === '31-50') return p.age >= 31 && p.age <= 50;
                if (ageFilter === '51+') return p.age >= 51;
                return true;
            });
        }

        this.renderPatientsTable(filteredPatients);
    }

    populatePatientSelects() {
        const selects = ['appointmentPatient', 'billingPatient'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Patient</option>' +
                    this.patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            }
        });
    }

    // ---------------- Doctors ----------------
    renderDoctors() {
        this.renderDoctorsGrid();
        this.populateDoctorSelects();
    }

    renderDoctorsGrid(list = this.doctors) {
        const grid = document.getElementById('doctorsGrid');
        if (!grid) return;

        grid.innerHTML = list.map(d => `
            <div class="doctor-card">
                <div class="doctor-avatar">${d.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="doctor-info">
                    <h3>${d.name}</h3>
                    <p class="doctor-specialization">${d.specialization}</p>
                    <span class="doctor-availability ${d.availability.toLowerCase().replace(' ', '-')}">${d.availability}</span>
                    <p class="doctor-rating">★ ${d.rating}</p>
                </div>
                <div class="doctor-actions">
                    <button class="btn btn-sm btn-primary" onclick="hms.editDoctor(${d.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="hms.deleteDoctor(${d.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    saveDoctor() {
        const name = document.getElementById('doctorName').value;
        const specialization = document.getElementById('doctorSpecialization').value;
        const availability = document.getElementById('doctorAvailability').value;
        const rating = parseFloat(document.getElementById('doctorRating').value);

        if (!name || !specialization || !availability || !rating) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        if (this.editingId) {
            const idx = this.doctors.findIndex(d => d.id === this.editingId);
            this.doctors[idx] = { ...this.doctors[idx], name, specialization, availability, rating };
            this.showToast('Doctor updated successfully', 'success');
        } else {
            const id = Math.max(...this.doctors.map(d => d.id), 0) + 1;
            this.doctors.push({ id, name, specialization, availability, rating });
            this.showToast('Doctor added successfully', 'success');
        }

        this.saveData();
        this.closeDoctorModal();
        this.renderDoctors();
        this.updateDashboardStats();
    }

    openDoctorModal(doctor = null) {
        document.getElementById('doctorModal').classList.add('active');
        this.editingId = doctor ? doctor.id : null;
        if (doctor) {
            document.getElementById('doctorName').value = doctor.name;
            document.getElementById('doctorSpecialization').value = doctor.specialization;
            document.getElementById('doctorAvailability').value = doctor.availability;
            document.getElementById('doctorRating').value = doctor.rating;
        } else {
            document.getElementById('doctorForm').reset();
        }
    }

    closeDoctorModal() {
        document.getElementById('doctorModal').classList.remove('active');
        this.editingId = null;
    }

    editDoctor(id) {
        const doctor = this.doctors.find(d => d.id === id);
        if (doctor) this.openDoctorModal(doctor);
    }

    deleteDoctor(id) {
        if (confirm('Are you sure you want to delete this doctor?')) {
            this.doctors = this.doctors.filter(d => d.id !== id);
            this.saveData();
            this.renderDoctors();
            this.updateDashboardStats();
            this.showToast('Doctor deleted successfully', 'success');
        }
    }

    filterDoctors() {
        const search = document.getElementById('doctorSearch').value.toLowerCase();
        const specialization = document.getElementById('specializationFilter').value;
        const availability = document.getElementById('availabilityFilter').value;

        const filteredDoctors = this.doctors.filter(d =>
            d.name.toLowerCase().includes(search) &&
            (!specialization || d.specialization === specialization) &&
            (!availability || d.availability === availability)
        );

        this.renderDoctorsGrid(filteredDoctors);
    }

    populateDoctorSelects() {
        const select = document.getElementById('appointmentDoctor');
        if (select) {
            select.innerHTML = '<option value="">Select Doctor</option>' +
                this.doctors.map(d => `<option value="${d.id}">${d.name} - ${d.specialization}</option>`).join('');
        }
    }

    // ---------------- Appointments ----------------
    renderAppointments() {
        this.renderAppointmentsTable();
        this.populateAppointmentSelects();
    }

    renderAppointmentsTable() {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.appointments.map(a => {
            const patient = this.patients.find(p => p.id === a.patientId);
            const doctor = this.doctors.find(d => d.id === a.doctorId);
            return `
                <tr>
                    <td>${a.id}</td>
                    <td>${patient ? patient.name : '-'}</td>
                    <td>${doctor ? doctor.name : '-'}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td><span class="status-badge ${a.status.toLowerCase()}">${a.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="hms.editAppointment(${a.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteAppointment(${a.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    saveAppointment() {
        const patientId = parseInt(document.getElementById('appointmentPatient').value);
        const doctorId = parseInt(document.getElementById('appointmentDoctor').value);
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;

        if (!patientId || !doctorId || !date || !time) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        const id = Math.max(...this.appointments.map(a => a.id), 0) + 1;
        this.appointments.push({ id, patientId, doctorId, date, time, status: 'Pending' });

        this.saveData();
        this.closeAppointmentModal();
        this.renderAppointments();
        this.updateDashboardStats();
        this.showToast('Appointment booked successfully', 'success');
    }

    openAppointmentModal() {
        document.getElementById('appointmentModal').classList.add('active');
    }

    closeAppointmentModal() {
        document.getElementById('appointmentModal').classList.remove('active');
        document.getElementById('appointmentForm').reset();
    }

    populateAppointmentSelects() {
        this.populatePatientSelects();
        this.populateDoctorSelects();
    }

    editAppointment(id) {
        // TODO: Implement appointment editing
        this.showToast('Edit appointment functionality coming soon', 'info');
    }

    deleteAppointment(id) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            this.appointments = this.appointments.filter(a => a.id !== id);
            this.saveData();
            this.renderAppointments();
            this.updateDashboardStats();
            this.showToast('Appointment deleted successfully', 'success');
        }
    }

    // ---------------- Billing ----------------
    renderBilling() {
        this.renderBillingTable();
        this.populateBillingSelects();
    }

    renderBillingTable() {
        const tbody = document.getElementById('billingTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.billing.map(b => {
            const patient = this.patients.find(p => p.id === b.patientId);
            return `
                <tr>
                    <td>${b.id}</td>
                    <td>${patient ? patient.name : '-'}</td>
                    <td>${b.services}</td>
                    <td>$${b.amount.toFixed(2)}</td>
                    <td><span class="status-badge ${b.status.toLowerCase()}">${b.status}</span></td>
                    <td>${b.date}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="hms.editBilling(${b.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="hms.deleteBilling(${b.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    saveBilling() {
        const patientId = parseInt(document.getElementById('billingPatient').value);
        const services = document.getElementById('billingServices').value;
        const amount = parseFloat(document.getElementById('billingAmount').value);
        const status = document.getElementById('billingStatus').value;

        if (!patientId || !services || !amount || !status) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        const id = Math.max(...this.billing.map(b => b.id), 0) + 1;
        this.billing.push({ id, patientId, services, amount, status, date: new Date().toISOString().split('T')[0] });

        this.saveData();
        this.closeBillingModal();
        this.renderBilling();
        this.updateDashboardStats();
        this.showToast('Billing record created successfully', 'success');
    }

    openBillingModal() {
        document.getElementById('billingModal').classList.add('active');
    }

    closeBillingModal() {
        document.getElementById('billingModal').classList.remove('active');
        document.getElementById('billingForm').reset();
    }

    populateBillingSelects() {
        // Billing uses the same patient select as appointments
        this.populatePatientSelects();
    }

    editBilling(id) {
        // TODO: Implement billing editing
        this.showToast('Edit billing functionality coming soon', 'info');
    }

    deleteBilling(id) {
        if (confirm('Are you sure you want to delete this billing record?')) {
            this.billing = this.billing.filter(b => b.id !== id);
            this.saveData();
            this.renderBilling();
            this.updateDashboardStats();
            this.showToast('Billing record deleted successfully', 'success');
        }
    }

    // ---------------- Reports ----------------
    renderReports() {
        this.updateReportStats();
        this.setupReportEventListeners();
    }

    updateReportStats() {
        // Update report statistics
        document.getElementById('totalPatientsReport').textContent = this.patients.length;
        document.getElementById('totalDoctorsReport').textContent = this.doctors.length;
        document.getElementById('totalAppointmentsReport').textContent = this.appointments.length;
        
        const totalRevenue = this.billing
            .filter(bill => bill.status === 'Paid')
            .reduce((sum, bill) => sum + bill.amount, 0);
        document.getElementById('totalRevenueReport').textContent = `$${totalRevenue.toFixed(2)}`;
    }

    setupReportEventListeners() {
        const generateBtn = document.getElementById('generateReportBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateReport());
        }

        // Add event listeners for filter changes
        const reportType = document.getElementById('reportType');
        const dateRange = document.getElementById('dateRange');
        const departmentFilter = document.getElementById('departmentFilter');

        if (reportType) {
            reportType.addEventListener('change', () => this.updateReportContent());
        }
        if (dateRange) {
            dateRange.addEventListener('change', () => this.updateReportContent());
        }
        if (departmentFilter) {
            departmentFilter.addEventListener('change', () => this.updateReportContent());
        }
    }

    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const dateRange = document.getElementById('dateRange').value;
        const department = document.getElementById('departmentFilter').value;

        // Show loading state
        const generateBtn = document.getElementById('generateReportBtn');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;

        // Simulate report generation
        setTimeout(() => {
            this.updateReportContent();
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
            this.showToast(`Report generated successfully for ${reportType}`, 'success');
        }, 1500);
    }

    updateReportContent() {
        const reportType = document.getElementById('reportType').value;
        const dateRange = document.getElementById('dateRange').value;
        const department = document.getElementById('departmentFilter').value;

        // Update report content based on filters
        console.log(`Updating report: ${reportType}, ${dateRange}, ${department}`);
        
        // Here you would typically fetch new data or update charts
        // For now, we'll just show a success message
        this.showToast('Report content updated', 'info');
    }

    // ---------------- Utility Functions ----------------
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const container = document.querySelector('.toast-container');
        if (container) {
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
    }
}

// Global instance
const hms = new HospitalManagementSystem();
