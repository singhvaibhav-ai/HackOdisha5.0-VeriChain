// A class to manage the VeriChain application frontend
class VeriChain {
    constructor() {
        // State variables
        this.connectedWallet = null;
        this.credentials = [];
        this.credentialCounter = 1;

        // Initialize the application
        this.init();
    }

    // Main initialization function
    init() {
        this.bindEvents();
        this.loadDemoData();
        this.updateStats();
        this.updateStudentDashboard(); // Initial call to show empty state
    }

    // Load some initial data for demonstration purposes
    loadDemoData() {
        const demoCredentials = [{
            id: 'VRC-001',
            studentName: 'Alice Johnson',
            degree: 'B.Tech Computer Science',
            university: 'IIT Delhi',
            year: '2024',
            cgpa: '9.2',
            studentWallet: '0xab...cdef',
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            timestamp: new Date().toISOString()
        }];
        this.credentials.push(...demoCredentials);
        this.credentialCounter = this.credentials.length + 1;
    }

    // Bind all necessary event listeners
    bindEvents() {
        // Wallet connection button
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());

        // Tab switching buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
        });

        // Form submission listeners
        document.getElementById('issueForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.issueCredential();
        });

        document.getElementById('verifyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyCredential();
        });
    }

    // Simulate connecting to a user's wallet
    async connectWallet() {
        this.showNotification('Connecting to wallet...', 'warning');
        await this.delay(1500); // Simulate connection time

        // Generate a random, realistic wallet address for the demo
        const address = '0x' + this.generateRandomHex(40);
        this.connectedWallet = address;

        // Update UI to show connected state
        const walletBtn = document.getElementById('connectWallet');
        const walletText = document.getElementById('walletText');
        const walletInfo = document.getElementById('walletInfo');
        const walletAddress = document.getElementById('walletAddress');

        walletBtn.style.background = 'var(--success)';
        walletText.textContent = 'Connected';
        walletInfo.classList.remove('hidden');
        walletAddress.textContent = this.formatAddress(address);

        this.showNotification('Wallet connected successfully!', 'success');
        this.updateStudentDashboard();
    }

    // Handle the credential issuance form submission
    async issueCredential() {
        const resultDiv = document.getElementById('issueResult');
        const formData = this.getFormData('issueForm');
        
        // Show loading state
        resultDiv.className = 'result-section warning';
        resultDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Minting credential on the blockchain... This may take a moment.`;
        resultDiv.classList.remove('hidden');
        
        await this.delay(2500); // Simulate minting time

        // Create a new credential object with simulated blockchain data
        const credential = {
            id: `VRC-${String(this.credentialCounter).padStart(3, '0')}`,
            ...formData,
            txHash: '0x' + this.generateRandomHex(64),
            timestamp: new Date().toISOString()
        };

        this.credentials.push(credential);
        this.credentialCounter++;

        // Display success message
        resultDiv.className = 'result-section success';
        resultDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success);"></i>
                <div>
                    <h3 style="color: var(--success);">Credential Minted Successfully!</h3>
                    <p><strong>ID: ${credential.id}</strong> | Transaction: <a href="#" onclick="return false;">${this.formatHash(credential.txHash)}</a></p>
                </div>
            </div>`;
        
        this.updateStats();
        this.updateStudentDashboard();
        document.getElementById('issueForm').reset();
    }

    // Handle the credential verification form submission
    async verifyCredential() {
        const resultDiv = document.getElementById('verifyResult');
        const credentialId = document.getElementById('credentialId').value.trim();
        const walletToVerify = document.getElementById('verifyWallet').value.trim().toLowerCase();

        resultDiv.className = 'result-section warning';
        resultDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verifying credential on the blockchain...`;
        resultDiv.classList.remove('hidden');

        await this.delay(2000);

        const credential = this.credentials.find(c => c.id.toLowerCase() === credentialId.toLowerCase());

        if (!credential) {
            resultDiv.className = 'result-section error';
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-times-circle" style="font-size: 2rem; color: var(--error);"></i>
                    <div>
                        <h3 style="color: var(--error);">Verification Failed</h3>
                        <p>No credential found with ID: <code>${credentialId}</code></p>
                    </div>
                </div>`;
            return;
        }

        const isOwner = credential.studentWallet.toLowerCase() === walletToVerify;

        if (isOwner) {
            resultDiv.className = 'result-section success';
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-shield-alt" style="font-size: 2rem; color: var(--success);"></i>
                    <div>
                        <h3 style="color: var(--success);">✅ Verified Authentic</h3>
                        <p>This credential belongs to the provided wallet address.</p>
                    </div>
                </div>
                <hr style="border-color: var(--border); margin: 1rem 0;">
                <p><strong>Student:</strong> ${credential.studentName}</p>
                <p><strong>Degree:</strong> ${credential.degree}</p>
                <p><strong>University:</strong> ${credential.university}</p>`;
        } else {
            resultDiv.className = 'result-section error';
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--error);"></i>
                    <div>
                        <h3 style="color: var(--error);">❌ Ownership Mismatch</h3>
                        <p>This credential is <strong>valid</strong>, but does not belong to the claimed wallet.</p>
                    </div>
                </div>`;
        }
    }

    // Switch between the main tabs (University, Student, Employer)
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        if (tabName === 'student') {
            this.updateStudentDashboard();
        }
    }

    // Update the student's personal dashboard with their credentials
    updateStudentDashboard() {
        const credentialsDiv = document.getElementById('studentCredentials');
        if (!this.connectedWallet) {
            credentialsDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet"></i>
                    <h3>Connect Your Wallet</h3>
                    <p>Connect your wallet to view your digital credentials.</p>
                </div>`;
            return;
        }

        const userCredentials = this.credentials.filter(c => c.studentWallet.toLowerCase() === this.connectedWallet.toLowerCase());

        if (userCredentials.length === 0) {
            credentialsDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No Credentials Found</h3>
                    <p>Credentials issued to <code>${this.formatAddress(this.connectedWallet)}</code> will appear here.</p>
                </div>`;
        } else {
            credentialsDiv.innerHTML = userCredentials.map(cred => `
                <div class="credential-card">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">🎓 ${cred.degree}</h4>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${cred.university} - ${cred.year}</p>
                    <div class="detail-grid">
                        <div><strong>Student:</strong> ${cred.studentName}</div>
                        <div><strong>CGPA:</strong> ${cred.cgpa}</div>
                        <div><strong>ID:</strong> <code>${cred.id}</code></div>
                        <div><strong>Issued:</strong> ${new Date(cred.timestamp).toLocaleDateString()}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update the main statistics in the hero section
    updateStats() {
        document.getElementById('credentialsIssued').textContent = this.credentials.length;
    }

    // Helper Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        
        // Add basic styling for notification
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.innerHTML = `
                .notification {
                    position: fixed; top: 80px; right: 20px; padding: 1rem 1.5rem;
                    color: white; border-radius: 0.5rem; z-index: 1001;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    animation: slideIn 0.3s ease-out;
                }
                .notification.success { background: var(--success); }
                .notification.error { background: var(--error); }
                .notification.warning { background: var(--warning); }
            `;
            document.head.appendChild(style);
        }
    }
    
    generateRandomHex(length) { return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''); }
    formatAddress(address) { return `${address.slice(0, 6)}...${address.slice(-4)}`; }
    formatHash(hash) { return `${hash.slice(0, 10)}...`; }
    getFormData(formId) {
        const data = {};
        new FormData(document.getElementById(formId)).forEach((value, key) => data[key] = value);
        return data;
    }
    delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => new VeriChain());