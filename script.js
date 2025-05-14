document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const API_BASE_URL = "YOUR_STIRLING_PDF_API_ENDPOINT_HERE"; //  <== !!! عدل هذا لاحقًا !!! e.g. http://localhost:8080/api/v1

    // تعريف الأدوات (يجب أن يتطابق مع ما هو متوفر في API الخاص بـ Stirling PDF)
    const PDF_TOOLS_CONFIG = [
        // مثال لأداة (استبدل وقائمة كاملة)
        { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one.', longDescription: 'Easily combine several PDF files in the order you select. Perfect for reports, presentations, or archiving.', icon: 'merge_type', apiPath: '/manipulation/merge', accept: '.pdf', multipleFiles: true, options: [] },
        { id: 'split-pdf', name: 'Split PDF', description: 'Extract specific pages or ranges.', longDescription: 'Divide your PDF into multiple documents by specifying page ranges or extracting individual pages.', icon: 'call_split', apiPath: '/manipulation/split', accept: '.pdf', multipleFiles: false, options: [
            { type: 'text', name: 'splitRanges', label: 'Page ranges (e.g., 1-3,5,7-end)', required: true, placeholder: '1-3,5,7-end' }
        ]},
        { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size.', longDescription: 'Optimize your PDF files to reduce their size for easier sharing and storage, with different compression levels.', icon: 'compress', apiPath: '/optimize/compress-pdf', accept: '.pdf', multipleFiles: false, options: [
            { type: 'select', name: 'compressionLevel', label: 'Compression Level', required: true, options: [
                { value: 'low', text: 'Low (Better Quality)' },
                { value: 'medium', text: 'Medium (Recommended)' },
                { value: 'high', text: 'High (Smaller Size)' }
            ], defaultValue: 'medium' }
        ]},
        { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to DOCX.', longDescription: 'Transform your PDFs into editable Microsoft Word (DOCX) documents. Layout retention may vary.', icon: 'description', apiPath: '/convert/pdf-to-word', accept: '.pdf', multipleFiles: false, options: [] },
        { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert DOCX to PDF.', longDescription: 'Convert Microsoft Word (DOCX, DOC) documents into professional PDF files.', icon: 'picture_as_pdf', apiPath: '/convert/office-to-pdf', accept: '.doc,.docx', multipleFiles: true, options: [] },
        { id: 'images-to-pdf', name: 'Images to PDF', description: 'Convert JPG, PNG to PDF.', longDescription: 'Combine multiple images (JPG, PNG, GIF, TIFF, BMP) into a single, easy-to-share PDF document.', icon: 'image', apiPath: '/convert/img-to-pdf', accept: 'image/*', multipleFiles: true, options: [] },
        { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password to PDF.', longDescription: 'Secure your PDF file with a password to prevent unauthorized access. You can set separate open and permissions passwords.', icon: 'lock', apiPath: '/security/add-password', accept: '.pdf', multipleFiles: false, options: [
            { type: 'password', name: 'openPassword', label: 'Password to Open PDF', required: true },
            // { type: 'password', name: 'permissionsPassword', label: 'Password for Permissions (Optional)'} // Stirling might handle this differently
        ]},
        { id: 'ocr-pdf', name: 'OCR PDF', description: 'Make scanned PDFs searchable.', longDescription: 'Apply Optical Character Recognition (OCR) to your scanned PDFs or images to make the text searchable and copyable.', icon: 'document_scanner', apiPath: '/ocr/ocr-pdf', accept: '.pdf,image/*', multipleFiles: false, options: [
            { type: 'select', name: 'ocrLanguage', label: 'Language for OCR', required: true, options: [
                { value: 'eng', text: 'English' }, { value: 'ara', text: 'Arabic' }, { value: 'spa', text: 'Spanish' }, /* ... more languages */
            ], defaultValue: 'eng' }
        ]},
        // --- أضف المزيد من الأدوات هنا لتصل إلى 20+ ---
        // مثال:
        { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages.', longDescription: 'Rotate all or specific pages in your PDF file by 90, 180, or 270 degrees.', icon: 'rotate_right', apiPath: '/manipulation/rotate', accept: '.pdf', multipleFiles: false, options: [
            { type: 'select', name: 'angle', label: 'Rotation Angle', required: true, options: [{value: '90', text:'90° Clockwise'}, {value:'180', text:'180°'}, {value:'270', text:'270° Clockwise'}] }
        ]},
        { id: 'add-page-numbers', name: 'Add Page Numbers', description: 'Insert page numbers.', longDescription: 'Easily add page numbers to your PDF files. Customize position, format, and starting number.', icon: 'format_list_numbered', apiPath: '/manipulation/add-page-numbers', accept: '.pdf', multipleFiles: false, options: [ /* Define options like position, format */ ] },
        { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images.', longDescription: 'Extract all pages from your PDF as individual JPG image files.', icon: 'collections', apiPath: '/convert/pdf-to-img', accept: '.pdf', multipleFiles: false, options: [/* Option for image format if API supports PNG too */] },

        // يجب أن يكون المجموع حوالي 22 أداة لتقليد Stirling PDF
        // ... أكمل القائمة مع مطابقة 'id' و 'apiPath' و 'options' بشكل صحيح لواجهة Stirling PDF API
    ];

    // --- DOM Elements ---
    const toolListView = document.getElementById('tool-list-view');
    const toolSpecificView = document.getElementById('tool-specific-view');
    const toolsGrid = document.getElementById('tools-grid');
    const searchInput = document.getElementById('search-tool-input');

    const backToListBtn = document.getElementById('back-to-list-btn');
    const currentToolIconContainer = document.getElementById('current-tool-icon-container');
    const currentToolTitle = document.getElementById('current-tool-title');
    const currentToolLongDescription = document.getElementById('current-tool-long-description');

    const fileUploadForm = document.getElementById('file-upload-form');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileInput = document.getElementById('file-input');
    const fileInputError = document.getElementById('file-input-error');
    const fileInputHint = document.getElementById('file-input-hint');
    const selectedFilesPreview = document.getElementById('selected-files-preview');
    const toolOptionsContainer = document.getElementById('tool-options-container');
    const processFileBtn = document.getElementById('process-file-btn');

    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressStatusText = document.getElementById('progress-status-text');

    const resultContainer = document.getElementById('result-container');
    const successMessage = document.getElementById('success-message');
    const downloadLink = document.getElementById('download-link');

    const errorMessageContainer = document.getElementById('error-message-container');
    const errorText = document.getElementById('error-text');

    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const homeLink = document.getElementById('home-link');
    const allToolsLink = document.getElementById('all-tools-link');


    let currentSelectedTool = null;
    let selectedFileObjects = []; // لتخزين كائنات الملفات المختارة

    // --- Functions ---

    // تبديل الوضع (فاتح/داكن)
    function toggleTheme() {
        const currentTheme = document.body.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme); // حفظ التفضيل
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        if (themeToggleButton) {
            const iconElement = themeToggleButton.querySelector('.material-symbols-rounded');
            if (iconElement) {
                iconElement.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        }
    }

    function applyInitialTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light'; // الافتراضي هو الفاتح
        document.body.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }


    // عرض قائمة الأدوات
    function renderTools(toolsToDisplay = PDF_TOOLS_CONFIG) {
        if (!toolsGrid) return;
        toolsGrid.innerHTML = '';
        toolsToDisplay.forEach(tool => {
            const col = document.createElement('div');
            col.className = 'col'; // Bootstrap grid column

            const card = document.createElement('div');
            card.className = 'tool-card shadow-sm h-100'; // h-100 لارتفاع متساوٍ
            card.style.cursor = 'pointer';
            card.dataset.toolId = tool.id;

            card.innerHTML = `
                <div class="tool-icon material-symbols-rounded">${tool.icon || 'handyman'}</div>
                <h5>${tool.name}</h5>
                <p class="mb-0">${tool.description}</p>
            `;
            card.addEventListener('click', () => showToolSpecificView(tool));
            col.appendChild(card);
            toolsGrid.appendChild(col);
        });
    }

    // عرض الواجهة الخاصة بأداة معينة
    function showToolSpecificView(tool) {
        currentSelectedTool = tool;
        if (toolListView) toolListView.classList.add('hidden-section');
        if (toolSpecificView) toolSpecificView.classList.remove('hidden-section');

        if (currentToolIconContainer) currentToolIconContainer.innerHTML = `<span class="material-symbols-rounded">${tool.icon || 'handyman'}</span>`;
        if (currentToolTitle) currentToolTitle.textContent = tool.name;
        if (currentToolLongDescription) currentToolLongDescription.textContent = tool.longDescription;

        if (fileInput) {
            fileInput.accept = tool.accept || '.pdf';
            fileInput.multiple = tool.multipleFiles || false;
            fileInput.value = ''; // مسح أي ملفات سابقة
        }
        if (fileInputHint) fileInputHint.textContent = `Allowed: ${tool.accept || '.pdf'}. ${tool.multipleFiles ? 'Multiple files allowed.' : 'Single file only.'}`;

        resetOperationState();
        renderToolOptions(tool);
        selectedFileObjects = []; // مسح الملفات المختارة السابقة
        updateSelectedFilesPreview(); // تحديث معاينة الملفات (يجب أن تكون فارغة)
        window.scrollTo(0, 0);
    }

    // العودة إلى قائمة الأدوات
    function showToolListView() {
        if (toolListView) toolListView.classList.remove('hidden-section');
        if (toolSpecificView) toolSpecificView.classList.add('hidden-section');
        currentSelectedTool = null;
        if (searchInput) searchInput.value = ''; // مسح البحث
        renderTools(); // إعادة عرض جميع الأدوات
        resetOperationState();
        window.scrollTo(0, 0);
    }

    // إعادة تعيين حالة العملية (التقدم، النتائج، الأخطاء)
    function resetOperationState() {
        if (fileUploadForm) fileUploadForm.classList.remove('was-validated');
        if (fileInputError) fileInputError.style.display = 'none';
        if (progressContainer) progressContainer.classList.add('hidden-section');
        if (progressBar) progressBar.style.width = '0%';
        if (progressPercentage) progressPercentage.textContent = '0%';
        if (progressStatusText) progressStatusText.textContent = 'Uploading...';
        if (resultContainer) resultContainer.classList.add('hidden-section');
        if (downloadLink) {
            downloadLink.href = '#';
            downloadLink.removeAttribute('download');
        }
        if (successMessage) successMessage.textContent = '';
        if (errorMessageContainer) errorMessageContainer.classList.add('hidden-section');
        if (errorText) errorText.textContent = '';
        if (processFileBtn) processFileBtn.disabled = false;
        if (toolOptionsContainer) toolOptionsContainer.innerHTML = ''; // مسح الخيارات الديناميكية
    }

    // عرض خيارات الأداة الديناميكية
    function renderToolOptions(tool) {
        if (!toolOptionsContainer) return;
        toolOptionsContainer.innerHTML = ''; // مسح الخيارات السابقة
        if (tool.options && tool.options.length > 0) {
            tool.options.forEach(opt => {
                const optDiv = document.createElement('div');
                optDiv.className = 'mb-3';

                const label = document.createElement('label');
                label.htmlFor = `option-${opt.name}`;
                label.className = 'form-label';
                label.textContent = opt.label + (opt.required ? ' *' : '');
                optDiv.appendChild(label);

                let inputElement;
                if (opt.type === 'select') {
                    inputElement = document.createElement('select');
                    inputElement.className = 'form-select';
                    opt.options.forEach(option => {
                        const o = document.createElement('option');
                        o.value = option.value;
                        o.textContent = option.text;
                        inputElement.appendChild(o);
                    });
                    if (opt.defaultValue) inputElement.value = opt.defaultValue;
                } else if (opt.type === 'checkbox') {
                    // Checkbox needs different structure for Bootstrap
                    optDiv.classList.add('form-check');
                    inputElement = document.createElement('input');
                    inputElement.type = 'checkbox';
                    inputElement.className = 'form-check-input';
                    label.className = 'form-check-label'; // Move label after input for checkbox
                    if (opt.checked) inputElement.checked = true;
                    optDiv.innerHTML = ''; // Clear previous label
                    optDiv.appendChild(inputElement);
                    optDiv.appendChild(label);

                } else { // text, password, number, url, email etc.
                    inputElement = document.createElement('input');
                    inputElement.type = opt.type;
                    inputElement.className = 'form-control';
                    if (opt.placeholder) inputElement.placeholder = opt.placeholder;
                    if (opt.defaultValue) inputElement.value = opt.defaultValue;
                }

                inputElement.name = opt.name;
                inputElement.id = `option-${opt.name}`;
                if (opt.required) inputElement.required = true;

                if (opt.type !== 'checkbox') { // For non-checkboxes, input is added after label
                    optDiv.appendChild(inputElement);
                }
                toolOptionsContainer.appendChild(optDiv);
            });
        }
    }


    // معالجة سحب وإفلات الملفات
    function setupDragAndDrop() {
        if (!fileDropArea || !fileInput) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false); // لمنع فتح الملف في المتصفح
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, () => fileDropArea.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, () => fileDropArea.classList.remove('drag-over'), false);
        });

        fileDropArea.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', handleFileSelectManual);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    function handleFileSelectManual(e){
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (!currentSelectedTool) return;
        const inputFiles = Array.from(files);

        if (!currentSelectedTool.multipleFiles && inputFiles.length > 1) {
            showError("This tool only accepts a single file.");
            selectedFileObjects = [inputFiles[0]]; // Take only the first one
        } else {
            selectedFileObjects = inputFiles;
        }
        fileInput.files = new DataTransfer().files; // Clear native input
        const dt = new DataTransfer();
        selectedFileObjects.forEach(f => dt.items.add(f));
        fileInput.files = dt.files; // Re-assign selected files to the input for form submission

        updateSelectedFilesPreview();
        if(fileInputError) fileInputError.style.display = 'none'; // Hide error if files are now selected
        fileUploadForm.classList.remove('was-validated');
    }

    function updateSelectedFilesPreview() {
        if (!selectedFilesPreview) return;
        if (selectedFileObjects.length === 0) {
            selectedFilesPreview.innerHTML = '';
        } else {
            let html = `<p class="mb-1">Selected file(s):</p><ul class="list-unstyled">`;
            selectedFileObjects.forEach(file => {
                html += `<li class="text-muted"><span class="material-symbols-rounded align-middle" style="font-size:1em;">draft</span> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`;
            });
            html += `</ul>`;
            selectedFilesPreview.innerHTML = html;
        }
    }

    // معالجة رفع الملف والاتصال بـ API
    async function handleFormSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!fileUploadForm.checkValidity() || (currentSelectedTool && selectedFileObjects.length === 0 && currentSelectedTool.id !== 'html-to-pdf')) {
            fileUploadForm.classList.add('was-validated');
            if(selectedFileObjects.length === 0 && fileInputError) {
                fileInputError.style.display = 'block';
            }
            return;
        }


        if (!currentSelectedTool) {
            showError("No tool selected. This shouldn't happen.");
            return;
        }

        if (selectedFileObjects.length === 0 && !(currentSelectedTool.id === 'html-to-pdf' && fileUploadForm.querySelector('input[name="urlInput"]')?.value)) {
             showError("Please select at least one file.");
             if(fileInputError) fileInputError.style.display = 'block';
             fileUploadForm.classList.add('was-validated');
             return;
        }


        if (progressContainer) progressContainer.classList.remove('hidden-section');
        if (progressBar) progressBar.style.width = '0%';
        if (progressPercentage) progressPercentage.textContent = '0%';
        if (progressStatusText) progressStatusText.textContent = 'Preparing...';
        if (processFileBtn) processFileBtn.disabled = true;
        if (resultContainer) resultContainer.classList.add('hidden-section');
        if (errorMessageContainer) errorMessageContainer.classList.add('hidden-section');


        const formData = new FormData(fileUploadForm); // يشمل خيارات الأداة إذا كانت موجودة

        // إضافة الملفات إلى FormData
        // StirlingPDF API يتوقع غالبًا الملفات تحت اسم 'fileInput'
        selectedFileObjects.forEach(file => {
            formData.append('fileInput', file, file.name);
        });


        const apiUrl = `${API_BASE_URL}${currentSelectedTool.apiPath}`;

        try {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", apiUrl, true);
            // xhr.setRequestHeader("Authorization", "Bearer YOUR_API_KEY"); // إذا كان API يتطلب مفتاحًا

            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    const percentage = Math.round((e.loaded / e.total) * 100);
                    if (progressBar) progressBar.style.width = percentage + '%';
                    if (progressPercentage) progressPercentage.textContent = percentage + '%';
                    if (progressStatusText) progressStatusText.textContent = 'Uploading...';
                }
            };
            
            xhr.onprogress = function (e) { // لتقدم التحميل من الخادم (إذا كان الخادم يدعم ذلك)
                if (e.lengthComputable && xhr.upload.onprogress === null) { // فقط إذا انتهى الرفع
                     if (progressStatusText) progressStatusText.textContent = 'Server Processing...';
                }
            };


            xhr.onloadstart = function () {
                if (progressStatusText) progressStatusText.textContent = 'Connecting to server...';
            };

            xhr.onload = function() {
                if (processFileBtn) processFileBtn.disabled = false;
                if (progressBar && progressBar.style.width !== '100%') { // إذا لم يكتمل الرفع لسبب ما
                    progressBar.style.width = '100%';
                    if (progressPercentage) progressPercentage.textContent = '100%';
                }
                if (progressStatusText) progressStatusText.textContent = 'Processing complete.';

                if (xhr.status >= 200 && xhr.status < 300) {
                    const contentType = xhr.getResponseHeader('Content-Type');
                    const disposition = xhr.getResponseHeader('Content-Disposition');
                    let filename = "processed_file";

                    if (disposition && disposition.includes('attachment')) {
                        const filenameMatch = disposition.match(/filename\*?=['"]?(?:UTF-\d'')?([^;\r\n"']+)['"]?/i);
                        if (filenameMatch && filenameMatch[1]) {
                            filename = decodeURIComponent(filenameMatch[1]);
                        }
                    } else {
                        const toolNameSlug = currentSelectedTool.name.toLowerCase().replace(/\s+/g, '-');
                        let ext = '.dat';
                        if (contentType) {
                            if (contentType.includes('pdf')) ext = '.pdf';
                            else if (contentType.includes('zip')) ext = '.zip'; // e.g. PDF to Images
                            else if (contentType.includes('msword') || contentType.includes('wordprocessingml')) ext = '.docx';
                            else if (contentType.includes('image/jpeg')) ext = '.jpg';
                            else if (contentType.includes('image/png')) ext = '.png';
                            else if (contentType.includes('text/plain')) ext = '.txt';
                        }
                        filename = `${toolNameSlug}-result${ext}`;
                    }

                    const blob = xhr.response;
                    const url = window.URL.createObjectURL(blob);
                    if (downloadLink) {
                        downloadLink.href = url;
                        downloadLink.download = filename;
                    }
                    if (successMessage) successMessage.textContent = `"${currentSelectedTool.name}" process completed successfully!`;
                    if (resultContainer) resultContainer.classList.remove('hidden-section');
                    // downloadLink.click(); // اختيارى: تحميل تلقائي

                } else {
                    let errorMsg = `Server error: ${xhr.status} ${xhr.statusText}`;
                     try {
                        const errorResponseText = xhr.responseText;
                        if(errorResponseText){
                            // StirlingPDF قد يعيد رسالة خطأ كنص عادي أو JSON بسيط
                            try {
                                const jsonError = JSON.parse(errorResponseText);
                                errorMsg = jsonError.message || jsonError.error || errorResponseText.substring(0, 200);
                            } catch (parseError) {
                                errorMsg = errorResponseText.substring(0, 200); // أظهر جزءًا من النص إذا لم يكن JSON
                            }
                        }
                    } catch (e) { /* تجاهل خطأ تحليل الاستجابة */ }
                    showError(errorMsg);
                }
            };

            xhr.onerror = function() {
                if (processFileBtn) processFileBtn.disabled = false;
                showError("An error occurred during the upload. Please check your network connection or API endpoint.");
            };

            xhr.responseType = 'blob'; // مهم لمعالجة تنزيل الملفات
            xhr.send(formData);

        } catch (error) {
            if (processFileBtn) processFileBtn.disabled = false;
            showError(`Client-side error: ${error.message || error}`);
            console.error("Upload error:", error);
        }
    }

    // عرض رسالة خطأ
    function showError(message) {
        if (errorText) errorText.textContent = message;
        if (errorMessageContainer) errorMessageContainer.classList.remove('hidden-section');
        if (progressContainer) progressContainer.classList.add('hidden-section'); // إخفاء شريط التقدم عند الخطأ
    }

    // فلترة الأدوات بناءً على البحث
    function filterTools() {
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filtered = PDF_TOOLS_CONFIG.filter(tool =>
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.id.toLowerCase().includes(searchTerm)
        );
        renderTools(filtered);
    }


    // --- Event Listeners ---
    if (themeToggleButton) themeToggleButton.addEventListener('click', toggleTheme);
    if (backToListBtn) backToListBtn.addEventListener('click', showToolListView);
    if (homeLink) homeLink.addEventListener('click', (e) => { e.preventDefault(); showToolListView(); });
    if (allToolsLink) allToolsLink.addEventListener('click', (e) => { e.preventDefault(); showToolListView(); });
    if (fileUploadForm) fileUploadForm.addEventListener('submit', handleFormSubmit);
    if (searchInput) searchInput.addEventListener('input', filterTools);


    // --- Initialization ---
    applyInitialTheme();
    renderTools(); // عرض جميع الأدوات عند تحميل الصفحة
    showToolListView(); // التأكد من عرض قائمة الأدوات أولاً
    setupDragAndDrop();
    if (document.getElementById('current-year')) {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
});
