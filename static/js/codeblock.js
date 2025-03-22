document.addEventListener('DOMContentLoaded', function() {
    // Find all code blocks and wrap them in our custom structure
    document.querySelectorAll('pre').forEach(function(pre) {
        // Try to get language from pre or code class
        let language = '';
        const code = pre.querySelector('code');
        
        if (code) {
            // First try to get from code element classes
            const codeClasses = Array.from(code.classList);
            language = codeClasses.find(cls => cls.startsWith('language-'))?.replace('language-', '') ||
                      codeClasses.find(cls => !cls.includes('-')); // Direct language class
        }
        
        if (!language) {
            // Try to get from pre element classes
            const preClasses = Array.from(pre.classList);
            language = preClasses.find(cls => cls.startsWith('language-'))?.replace('language-', '') ||
                      preClasses.find(cls => !cls.includes('-')); // Direct language class
        }
        
        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'code-block-header';
        header.innerHTML = `
            <div class="mac-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
            </div>
            <div class="header-center">
                ${language ? `<span class="lang-label">${language.toUpperCase()}</span>` : ''}
            </div>
            <div class="header-buttons">
                <button class="zoom-button">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z"/>
                    </svg>
                </button>
                <button class="copy-button">
                    <svg class="copy-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                    </svg>
                    <svg class="check-icon" viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'code-block-content';
        
        // Move the pre element inside
        pre.parentNode.insertBefore(wrapper, pre);
        contentWrapper.appendChild(pre);
        wrapper.appendChild(header);
        wrapper.appendChild(contentWrapper);
        
        // Add click handler for copy
        const copyButton = header.querySelector('.copy-button');
        copyButton.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                const code = pre.textContent;
                await navigator.clipboard.writeText(code);
                
                copyButton.classList.add('copied');
                setTimeout(() => copyButton.classList.remove('copied'), 1000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
        
        // Add click handler for zoom
        const zoomButton = header.querySelector('.zoom-button');
        zoomButton.addEventListener('click', function() {
            const codeLightbox = document.createElement('div');
            codeLightbox.className = 'code-lightbox';
            codeLightbox.innerHTML = `
                <button class="code-lightbox-close">&times;</button>
                <div class="code-lightbox-content">
                    <div class="code-block-wrapper">
                        <div class="code-block-header">
                            <div class="mac-dots">
                                <span class="dot dot-red"></span>
                                <span class="dot dot-yellow"></span>
                                <span class="dot dot-green"></span>
                            </div>
                            <div class="header-center">
                                ${language ? `<span class="lang-label">${language.toUpperCase()}</span>` : ''}
                            </div>
                            <div class="header-buttons">
                                <button class="copy-button">
                                    <svg class="copy-icon" viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                                    </svg>
                                    <svg class="check-icon" viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="code-block-content">
                            ${pre.outerHTML}
                        </div>
                    </div>
                </div>
            `;
            
            // Add copy handler to lightbox copy button
            const lightboxCopyButton = codeLightbox.querySelector('.copy-button');
            lightboxCopyButton.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                try {
                    const code = pre.textContent;
                    await navigator.clipboard.writeText(code);
                    lightboxCopyButton.classList.add('copied');
                    setTimeout(() => {
                        lightboxCopyButton.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
            
            document.body.appendChild(codeLightbox);
            setTimeout(() => codeLightbox.classList.add('active'), 0);
            document.body.style.overflow = 'hidden';
            
            // Handle lightbox close
            function closeCodeLightbox() {
                codeLightbox.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => codeLightbox.remove(), 300);
            }
            
            const closeButton = codeLightbox.querySelector('.code-lightbox-close');
            closeButton.addEventListener('click', closeCodeLightbox);
            codeLightbox.addEventListener('click', function(e) {
                if (e.target === codeLightbox) {
                    closeCodeLightbox();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && codeLightbox.classList.contains('active')) {
                    closeCodeLightbox();
                }
            });
        });
    });
});
