class VeriChain {
    constructor() {
        this.connectedWallet = null;
        this.credentials = [];
        this.credentialCounter = 1;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
        this.loadDemoData();
    }

    loadDemoData() {
        // Add some demo credentials for impressive stats
        const demoCredentials = [
            {
                id: 'DEMO-001',
                studentName: 'Alice Johnson',
                degree: 'B.Tech Computer Science',
                university: 'IIT Delhi',
                year: '2024',
                cgpa: '9.2'
            },
            {
                id: 'DEMO-002',
                studentName: 'Bob Smith',
                degree: 'M.Tech AI & ML',
                university: 'NIT Surathkal',
                year: '2024',
                cgpa: '8.8'
            }
        ];
        
        this.credentials.push(...demoCredentials);
        this.credentialCounter = demoCredentials.length + 1;
        this.updateStats();
    }

    bindEvents() {
        // Wallet connection
        document.getElementById('connectWallet').addEventListener('click', () => {
            this.connectWallet();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.tab-btn').dataset.tab);
            });
        });

        // Form submissions
        document.getElementById('issueForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.issueCredential();
        });

        document.getElementById('verifyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyCredential();
        });
    }

    async connectWallet() {
        try {
            // Simulate MetaMask connection with realistic delay
            this.showNotification('Connecting to MetaMask...', 'warning');
            
            await this.delay(1500);
            
            // Generate realistic wallet address
            const address = '0x' + this.generateRandomHex(40);
            this.connectedWallet = address;
            
            // Update UI
            const walletBtn = document.getElementById('connectWallet');
            const walletText = document.getElementById('walletText');
            const walletInfo = document.getElementById('walletInfo');
            const walletAddress = document.getElementById('walletAddress');
            
            walletBtn.style.background = '#10b981';
            walletText.textContent = 'Connected';
            walletInfo.classList.remove('hidden');
            walletAddress.textContent = this.formatAddress(address);
            
            this.showNotification('Wallet connected successfully!', 'success');
            this.updateStudentDashboard();
            
        } catch (error) {
            this.showNotification('Failed to connect wallet', 'error');
        }
    }

    async issueCredential() {
        if (!this.connectedWallet) {
            this.showNotification('Please connect your wallet first!', 'error');
            return;
        }

        const formData = this.getFormData('issueForm');
        const resultDiv = document.getElementById('issueResult');
        
        // Show loading state
        resultDiv.className = 'result-section warning';
        resultDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-spinner fa-spin"></i>
                <div>
                    <h3>Minting Credential NFT...</h3>
                    <p>Processing on Sepolia testnet. This may take a moment.</p>
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');

        await this.delay(3000);

        // Create credential
        const credential = {
            id: `VRC-${String(this.credentialCounter).padStart(3, '0')}`,
            ...formData,
            txHash: '0x' + this.generateRandomHex(64),
            contractAddress: '0x' + this.generateRandomHex(40),
            tokenId: this.credentialCounter,
            timestamp: new Date().toISOString(),
            blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
            gasUsed: Math.floor(Math.random() * 50000) + 100000
        };

        this.credentials.push(credential);
        this.credentialCounter++;

        // Show success
        resultDiv.className = 'result-section success';
        resultDiv.innerHTML = `
            <div class="credential-result">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: #10b981;"></i>
                    <div>
                        <h3>Credential Successfully Minted! 🎉</h3>
                        <p>Academic credential has been permanently recorded on the blockchain</p>
                    </div>
                </div>
                
                <div class="credential-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Credential ID:</strong> 
                            <code>${credential.id}</code>
                        </div>
                        <div class="detail-item">
                            <strong>Student:</strong> 
                            ${credential.studentName}
                        </div>
                        <div class="detail-item">
                            <strong>Degree:</strong> 
                            ${credential.degree}
                        </div>
                        <div class="detail-item">
                            <strong>Transaction Hash:</strong> 
                            <a href="https://sepolia.etherscan.io/tx/${credential.txHash}" target="_blank" style="color: #667eea;">
                                ${this.formatHash(credential.txHash)}
                            </a>
                        </div>
                        <div class="detail-item">
                            <strong>Token ID:</strong> 
                            #${credential.tokenId}
                        </div>
                        <div class="detail-item">
                            <strong>Gas Used:</strong> 
                            ${credential.gasUsed.toLocaleString()} gwei
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 0.5rem; border: 1px solid #10b981;">
                    <p><strong>Next Steps:</strong></p>
                    <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                        <li>Share the Credential ID (${credential.id}) with the student</li>
                        <li>Student can view this credential in their dashboard</li>
                        <li>Employers can verify using the Credential ID</li>
                    </ul>
                </div>
            </div>
        `;

        this.updateStats();
        this.updateStudentDashboard();
        this.clearForm('issueForm');
        this.showNotification('Credential minted successfully!', 'success');
    }

    async verifyCredential() {
        const credentialId = document.getElementById('credentialId').value;
        const walletToVerify = document.getElementById('verifyWallet').value;
        const resultDiv = document.getElementById('verifyResult');

        // Show loading
        resultDiv.className = 'result-section warning';
        resultDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-search fa-spin"></i>
                <div>
                    <h3>Verifying on Blockchain...</h3>
                    <p>Checking credential authenticity and ownership</p>
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');

        await this.delay(2000);

        const credential = this.credentials.find(c => c.id === credentialId);

        if (!credential) {
            resultDiv.className = 'result-section error';
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-times-circle" style="font-size: 2rem;"></i>
                    <div>
                        <h3>Credential Not Found</h3>
                        <p>No credential exists with ID: <code>${credentialId}</code></p>
                        <small>Please verify the credential ID and try again.</small>
                    </div>
                </div>
            `;
            return;
        }

        const isValidOwner = credential.studentWallet && 
                           credential.studentWallet.toLowerCase() === walletToVerify.toLowerCase();

        if (isValidOwner) {
            resultDiv.className = 'result-section success';
            resultDiv.innerHTML = `
                <div class="verification-success">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <i class="fas fa-shield-check" style="font-size: 3rem; color: #10b981;"></i>
                        <div>
                            <h3 style="color: #10b981;">✅ CREDENTIAL VERIFIED</h3>
                            <p>This credential is <strong>AUTHENTIC</strong> and belongs to the claimed wallet</p>
                        </div>
                    </div>
                    
                    <div class="credential-details">
                        <h4>📜 Credential Details</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <strong>Student Name:</strong> ${credential.studentName}
                            </div>
                            <div class="detail-item">
                                <strong>Degree:</strong> ${credential.degree}
                            </div>
                            <div class="detail-item">
                                <strong>University:</strong> ${credential.university}
                            </div>
                            <div class="detail-item">
                                <strong>Graduation Year:</strong> ${credential.year}
                            </div>
                            <div class="detail-item">
                                <strong>CGPA:</strong> ${credential.cgpa}/10.0
                            </div>
                            <div class="detail-item">
                                <strong>Issued:</strong> ${new Date(credential.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                        
                        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 0.5rem;">
                            <h5>🔗 Blockchain Proof</h5>
                            <p><strong>Token ID:</strong> #${credential.tokenId}</p>
                            <p><strong>Transaction:</strong> <a href="https://sepolia.etherscan.io/tx/${credential.txHash}" target="_blank" style="color: #667eea;">${this.formatHash(credential.txHash)}</a></p>
                            <p><strong>Contract:</strong> ${this.formatAddress(credential.contractAddress)}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.className = 'result-section error';
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                    <div>
                        <h3>❌ VERIFICATION FAILED</h3>
                        <p>Credential exists but does NOT belong to the provided wallet address</p>
                        <div style="margin-top: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem;">
                            <p><strong>Credential Owner:</strong> ${this.formatAddress(credential.studentWallet || 'Unknown')}</p>
                            <p><strong>Claimed Owner:</strong> ${this.formatAddress(walletToVerify)}</p>
                            <p><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">OWNERSHIP MISMATCH</span></p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Update student dashboard if switching to student tab
        if (tabName === 'student') {
            this.updateStudentDashboard();
        }
    }

    updateStudentDashboard() {
        const credentialsDiv = document.getElementById('studentCredentials');
        
        if (!this.connectedWallet) {
            credentialsDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet"></i>
                    <h3>Connect Your Wallet</h3>
                    <p>Connect your wallet to view your digital credentials</p>
                </div>
            `;
            return;
        }

        const userCredentials = this.credentials.filter(c => 
            c.studentWallet && c.studentWallet.toLowerCase() === this.connectedWallet.toLowerCase()
        );

        if (userCredentials.length === 0) {
            credentialsDiv.innerHTML = `
                <div class="credential-card">
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-graduation-cap" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
                        <h3>Welcome to VeriChain!</h3>
                        <p>Your wallet: <code>${this.formatAddress(this.connectedWallet)}</code></p>
                        <p style="margin-top: 1rem; color: #94a3b8;">No credentials found for this wallet yet.</p>
                        <p style="color: #94a3b8;">Digital credentials issued to this wallet will appear here.</p>
                    </div>
                </div>
            `;
        } else {
            let html = `
                <div class="credential-card">
                    <div style="text-align: center; padding: 1.5rem;">
                        <h3>🎉 Your Digital Portfolio</h3>
                        <p>Wallet: <code>${this.formatAddress(this.connectedWallet)}</code></p>
                        <p style="color: #10b981; font-weight: bold;">${userCredentials.length} Verified Credential(s)</p>
                    </div>
                </div>
            `;
            
            userCredentials.forEach(cred => {
                html += `
                    <div class="credential-card">
                        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
                            <div>
                                <h4 style="color: #667eea; margin-bottom: 0.5rem;">🎓 ${cred.degree}</h4>
                                <p style="color: #94a3b8;">${cred.university}</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem;">VERIFIED</span>
                            </div>
                        </div>
                        
                        <div class="detail-grid" style="margin-bottom: 1rem;">
                            <div><strong>Graduate:</strong> ${cred.studentName}</div>
                            <div><strong>Year:</strong> ${cred.year}</div>
                            <div><strong>CGPA:</strong> ${cred.cgpa}/10.0</div>
                            <div><strong>Credential ID:</strong> <code>${cred.id}</code></div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                            <button onclick="navigator.clipboard.writeText('${cred.id}')" style="flex: 1; padding: 0.5rem; background: #667eea; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                                📋 Copy ID
                            </button>
                            <button onclick="window.open('https://sepolia.etherscan.io/tx/${cred.txHash}', '_blank')" style="flex: 1; padding: 0.5rem; background: #10b981; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                                🔗 View on Chain
                            </button>
                        </div>
                    </div>
                `;
            });
            
            credentialsDiv.innerHTML = html;
        }
    }

    updateStats() {
        document.getElementById('credentialsIssued').textContent = this.credentials.length;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
            color: white;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Utility functions
    generateRandomHex(length) {
        return Array.from({length}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    formatAddress(address) {
        if (!address) return 'Unknown';
        return address.slice(0, 6) + '...' + address.slice(-4);
    }

    formatHash(hash) {
        return hash.slice(0, 10) + '...';
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    clearForm(formId) {
        document.getElementById(formId).reset();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-top: 1rem;
    }
    
    .detail-item {
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 0.5rem;
        font-size: 0.875rem;
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VeriChain();
});
