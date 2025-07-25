class PatternDetectionApp {
    constructor() {
        this.hiddenFiles = new Set();
        this.allFiles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadExistingFiles();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const clearBtn = document.getElementById('clearBtn');

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        uploadArea.addEventListener('click', () => fileInput.click());

        analyzeBtn.addEventListener('click', () => this.analyzePatterns());
        clearBtn.addEventListener('click', () => this.clearFiles());

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.name.endsWith('.txt'));
        if (files.length > 0) {
            this.uploadFiles(files);
        }
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files).filter(file => file.name.endsWith('.txt'));
        if (files.length > 0) {
            this.uploadFiles(files);
        }
    }

    async uploadFiles(files) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('textFiles', file);
        });

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.loadExistingFiles();
                this.showMessage('Files uploaded successfully', 'success');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            this.showError('File upload failed: ' + error.message);
        }
    }

    async loadExistingFiles() {
        try {
            const response = await fetch('/files');
            const data = await response.json();
            
            this.displayFileList(data.files);
            const visibleFiles = data.files.filter(file => !this.hiddenFiles.has(file));
            this.updateAnalyzeButton(visibleFiles.length > 0);
        } catch (error) {
            console.error('Failed to load file list:', error);
        }
    }

    displayFileList(files) {
        this.allFiles = files;
        const visibleFiles = files.filter(file => !this.hiddenFiles.has(file));
        const fileList = document.getElementById('fileList');
        
        if (visibleFiles.length === 0) {
            fileList.innerHTML = '<p style="color: #6c757d; text-align: center;">No files uploaded</p>';
            return;
        }

        fileList.innerHTML = visibleFiles.map(file => `
            <div class="file-item">
                <span class="file-name">${file}</span>
                <button class="delete-btn" onclick="app.hideFile('${file}')">Delete</button>
            </div>
        `).join('');
    }

    hideFile(filename) {
        this.hiddenFiles.add(filename);
        this.displayFileList(this.allFiles);
        const visibleFiles = this.allFiles.filter(file => !this.hiddenFiles.has(file));
        this.updateAnalyzeButton(visibleFiles.length > 0);
        this.showMessage('File hidden from view', 'success');
    }

    clearFiles() {
        this.allFiles.forEach(file => this.hiddenFiles.add(file));
        this.displayFileList(this.allFiles);
        this.updateAnalyzeButton(false);
        this.hideResults();
        this.showMessage('All files cleared from view', 'success');
    }

    updateAnalyzeButton(hasFiles) {
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = !hasFiles;
    }

    async analyzePatterns() {
        this.showLoading();
        this.hideResults();
        this.hideError();

        try {
            const response = await fetch('/analyze');
            const data = await response.json();

            this.hideLoading();
            this.displayResults(data);
        } catch (error) {
            this.hideLoading();
            this.showError('Pattern analysis failed: ' + error.message);
        }
    }

    displayResults(data) {
        const resultsSection = document.getElementById('resultsSection');
        const filesCount = document.getElementById('filesCount');
        const patternResults = document.getElementById('patternResults');
        const posResults = document.getElementById('posResults');

        filesCount.textContent = `Analyzed ${data.filesAnalyzed} files`;

        if (data.patterns.length === 0) {
            patternResults.innerHTML = '<p style="color: #6c757d; text-align: center;">No common text patterns found</p>';
        } else {
            patternResults.innerHTML = data.patterns.map((item, index) => {
                const rank = this.getRankString(index + 1);
                return `
                    <div class="pattern-item">
                        <div class="pattern-rank">${rank} longest pattern</div>
                        <div class="pattern-text">"${item.pattern}"</div>
                        <div class="pattern-count">Occurrences: ${item.count} | Length: ${item.length} words</div>
                    </div>
                `;
            }).join('');
        }

        if (data.posPatterns.length === 0) {
            posResults.innerHTML = '<p style="color: #6c757d; text-align: center;">No common POS patterns found</p>';
        } else {
            posResults.innerHTML = data.posPatterns.map((item, index) => {
                const rank = this.getRankString(index + 1);
                return `
                    <div class="pattern-item">
                        <div class="pattern-rank">${rank} longest POS pattern</div>
                        <div class="pattern-examples">
                            ${this.formatPosWithText(item.pattern, item.examples[0])}
                        </div>
                        <div class="pattern-count">Occurrences: ${item.count} | Length: ${item.length} tags</div>
                    </div>
                `;
            }).join('');
        }

        resultsSection.style.display = 'block';
    }

    colorizePattern(pattern) {
        return pattern.split(' ').map(tag => {
            return `<span class="pos-tag pos-${tag}">${tag}</span>`;
        }).join(' ');
    }

    formatPosWithText(posPattern, textExample) {
        if (!textExample) return '';
        
        const posTags = posPattern.split(' ');
        const words = textExample.split(' ');
        
        // Ensure we have matching lengths
        const minLength = Math.min(posTags.length, words.length);
        
        const wordContainers = [];
        for (let i = 0; i < minLength; i++) {
            // Handle special characters in POS tags for CSS class names
            const cleanTag = posTags[i].replace(/\$/g, 'S').replace(/[^a-zA-Z0-9]/g, '');
            wordContainers.push(`
                <div class="word-container">
                    <span class="pos-tag pos-${cleanTag}">${posTags[i]}</span>
                    <span class="word-text">${words[i]}</span>
                </div>
            `);
        }
        
        return `
            <div class="pos-text-alignment">
                ${wordContainers.join('')}
            </div>
        `;
    }

    getRankString(num) {
        let suffix;
        if (num % 100 >= 11 && num % 100 <= 13) {
            suffix = 'th';
        } else {
            switch (num % 10) {
                case 1: suffix = 'st'; break;
                case 2: suffix = 'nd'; break;
                case 3: suffix = 'rd'; break;
                default: suffix = 'th';
            }
        }
        return `${num}${suffix}`;
    }

    switchTab(e) {
        const tabName = e.target.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    showLoading() {
        document.getElementById('loadingSection').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingSection').style.display = 'none';
    }

    showError(message) {
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorSection').style.display = 'none';
    }

    hideResults() {
        document.getElementById('resultsSection').style.display = 'none';
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        if (type === 'success') {
            messageEl.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        } else if (type === 'error') {
            messageEl.style.background = 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)';
        }

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }
}

const app = new PatternDetectionApp();