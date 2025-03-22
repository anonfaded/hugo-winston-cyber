document.addEventListener('DOMContentLoaded', function() {
    // Only create ToC if we're on a blog post page and there are headings
    const content = document.querySelector('.content');
    if (!content) return;

    const headings = content.querySelectorAll('h1, h2, h3');
    if (headings.length === 0) return;

    // Create floating button
    const floatButton = document.createElement('button');
    floatButton.className = 'toc-float-button';
    floatButton.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M4 18h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h8c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm17.3 7.88L17.42 12l2.88-2.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0l-3.59 3.59c-.39.39-.39 1.02 0 1.41l3.59 3.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z"/>
        </svg>
    `;

    // Initialize TOC state based on screen size (changed breakpoint to include tablets)
    const mobileQuery = window.matchMedia('(max-width: 1024px)');
    let isCollapsed = mobileQuery.matches;

    // Create ToC container with initial state
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    // Set initial state based on screen size
    if (isCollapsed) {
        tocContainer.classList.add('collapsed');
    }

    // Add to page early to ensure elements exist
    document.body.appendChild(tocContainer);
    document.body.appendChild(floatButton);

    // Set up container contents
    tocContainer.innerHTML = `
        <div class="toc-header">
            <div class="toc-title">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
                </svg>
                <span>[NEURAL::INDEX]</span>
            </div>
            <button class="toc-toggle" aria-label="Close">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
        <div class="toc-content">
            <ul class="toc-list"></ul>
        </div>
        <div class="toc-keyboard-nav">
            <div class="keyboard-shortcuts">
                <span class="key" data-key="arrowup">↑</span>
                <span class="key" data-key="arrowdown">↓</span>
                <span class="key-label">nav</span>
                <span class="key" data-key="enter">⏎</span>
                <span class="key-label">go</span>
                <span class="key" data-key="escape">esc</span>
                <span class="key-label">close</span>
                <span class="key" data-key="shift+p">⇧P</span>
                <span class="key-label">toggle</span>
            </div>
        </div>`;

    // Update wrapper state immediately
    const wrapper = document.querySelector('.wrapper');
    wrapper?.classList.toggle('toc-collapsed', isCollapsed);

    // Update state on screen resize
    mobileQuery.addListener((e) => {
        isCollapsed = e.matches;
        tocContainer.classList.toggle('collapsed', isCollapsed);
        wrapper?.classList.toggle('toc-collapsed', isCollapsed);
    });

    // Generate ToC items with enhanced structure
    const tocList = tocContainer.querySelector('.toc-list');
    
    // Keep track of state
    let activeHeading = null;
    let activeLink = null;
    let isManualScroll = false;
    let currentIndex = -1;
    
    // Function to update active TOC link
    function updateActiveTocLink(newLink, index = -1) {
        if (activeLink) {
            activeLink.classList.remove('active');
            activeLink.closest('.toc-item')?.classList.remove('active');
        }
        if (newLink) {
            newLink.classList.add('active');
            newLink.closest('.toc-item')?.classList.add('active');
            if (index >= 0) currentIndex = index;
        }
        activeLink = newLink;
    }

    // Function to toggle ToC visibility
    function toggleToc() {
        isCollapsed = !isCollapsed;
        tocContainer.classList.toggle('collapsed', isCollapsed);
        wrapper?.classList.toggle('toc-collapsed', isCollapsed);
        
        tocContainer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
        tocContainer.style.opacity = isCollapsed ? '0' : '1';
        
        setTimeout(() => {
            tocContainer.style.transition = '';
        }, 300);
    }

    // Create a map of headings to their TOC links
    const headingToLinkMap = new Map();
    
    headings.forEach((heading, index) => {
        // Add heading animation line
        const underline = document.createElement('div');
        underline.className = 'heading-underline';
        heading.style.position = 'relative';
        heading.appendChild(underline);

        // Add hover effect
        heading.addEventListener('mouseenter', () => {
            heading.classList.add('hover-active');
        });
        heading.addEventListener('mouseleave', () => {
            heading.classList.remove('hover-active');
        });

        if (!heading.id) {
            heading.id = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const level = parseInt(heading.tagName.charAt(1));
        const listItem = document.createElement('li');
        listItem.className = `toc-item level-${level}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.className = 'toc-link';
        link.innerHTML = `<span class="toc-prefix">$ </span>${heading.textContent}`;
        
        // Add smooth scroll behavior
        link.addEventListener('click', (e) => {
            e.preventDefault();
            isManualScroll = true;
            const offsetTop = heading.offsetTop - 100;
            
            // Auto-collapse panel on mobile/tablet
            if (window.matchMedia('(max-width: 1024px)').matches) {
                toggleToc();
            }
            
            // Clear keyboard navigation states
            tocLinks.forEach(link => link.classList.remove('keyboard-focus'));
            currentIndex = -1; // Reset keyboard navigation index
            
            // Remove any existing animations
            document.querySelectorAll('.heading-active').forEach(h => h.classList.remove('heading-active'));
            
            // Calculate scroll duration based on distance
            const startPosition = window.pageYOffset;
            const distance = Math.abs(startPosition - offsetTop);
            const scrollDuration = Math.min(1000, Math.max(500, distance * 0.5)); // Dynamic duration
            
            // First scroll to the heading
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Track scroll completion and show animation
            let isScrolling;
            function checkScrollComplete() {
                if (Math.abs(window.pageYOffset - offsetTop) < 10) {
                    // Scroll is complete
                    heading.classList.add('heading-active');
                    updateActiveTocLink(link);
                    isManualScroll = false;
                    window.clearTimeout(isScrolling);
                } else {
                    // Keep checking until scroll completes
                    isScrolling = setTimeout(checkScrollComplete, 50);
                }
            }

            // Start checking scroll completion
            setTimeout(() => {
                checkScrollComplete();
            }, scrollDuration * 0.5); // Start checking halfway through expected duration

            // Fallback in case scroll detection fails
            setTimeout(() => {
                if (isManualScroll) {
                    heading.classList.add('heading-active');
                    updateActiveTocLink(link);
                    isManualScroll = false;
                }
            }, scrollDuration + 200); // Slightly longer than scroll duration
        });

        headingToLinkMap.set(heading, link);
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Update even during manual scroll to ensure robust tracking
                const currentHeading = entry.target;
                const correspondingLink = headingToLinkMap.get(currentHeading);
                
                if (entry.isIntersecting) {
                    // Update TOC and heading styles
                    updateActiveTocLink(correspondingLink, index);
                    
                    // Update active heading state
                    document.querySelectorAll('.heading-active').forEach(h => {
                        if (h !== currentHeading) {
                            h.classList.remove('heading-active');
                        }
                    });
                    currentHeading.classList.add('heading-active');
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '-10% 0px -70% 0px' // Adjusted margins for better tracking
        });

        // Add hover effect (only if not already active)
        heading.addEventListener('mouseenter', () => {
            if (!heading.classList.contains('heading-active')) {
                heading.classList.add('hover-effect');
            }
        });
        heading.addEventListener('mouseleave', () => {
            heading.classList.remove('hover-effect');
        });

        observer.observe(heading);
    });

    // Add click handlers
    const tocToggle = tocContainer.querySelector('.toc-toggle');
    tocToggle.addEventListener('click', toggleToc);
    floatButton.addEventListener('click', toggleToc);

    // Add keyboard navigation
    const tocLinks = Array.from(tocContainer.querySelectorAll('.toc-link'));
    
    function navigateToHeading(direction) {
        let newIndex = currentIndex;
        
        if (direction === 'next') {
            newIndex = Math.min(tocLinks.length - 1, currentIndex + 1);
        } else {
            newIndex = Math.max(0, currentIndex - 1);
        }

        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            const targetLink = tocLinks[currentIndex];
            
            tocLinks.forEach(link => link.classList.remove('keyboard-focus'));
            targetLink.classList.add('keyboard-focus');
            targetLink.scrollIntoView({ block: 'nearest' });
        }
    }

    // Add global keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Check for Shift+P to toggle ToC
        if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
            e.preventDefault();
            e.stopPropagation();
            toggleToc();
            
            // Add pressed state to Shift+P key
            const shiftPKey = tocContainer.querySelector('.key[data-key="shift+p"]');
            if (shiftPKey) {
                shiftPKey.classList.add('pressed');
                setTimeout(() => shiftPKey.classList.remove('pressed'), 200);
            }
            return;
        }

        const key = e.key.toLowerCase();
        const keyElement = tocContainer.querySelector(`.key[data-key="${key}"]`);
        
        if (keyElement) {
            keyElement.classList.add('pressed');
        }

        // Handle Escape to close panel
        if (key === 'escape' && !isCollapsed) {
            toggleToc();
            return;
        }

        // Only handle navigation when ToC is visible
        if (isCollapsed || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
        }

        switch (key) {
            case 'arrowdown':
                e.preventDefault();
                navigateToHeading('next');
                break;
            case 'arrowup':
                e.preventDefault();
                navigateToHeading('prev');
                break;
            case 'enter':
                e.preventDefault();
                if (currentIndex >= 0 && currentIndex < tocLinks.length) {
                    const targetLink = tocLinks[currentIndex];
                    const targetId = targetLink.getAttribute('href').substring(1);
                    const targetHeading = document.getElementById(targetId);
                    if (targetHeading) {
                        isManualScroll = true;
                        targetHeading.scrollIntoView({ behavior: 'smooth' });
                        updateActiveTocLink(targetLink);
                        setTimeout(() => {
                            isManualScroll = false;
                        }, 500);
                    }
                }
                break;
        }
    });

    // Remove pressed state on key up
    document.addEventListener('keyup', function(e) {
        const key = e.key.toLowerCase();
        const keyElement = tocContainer.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) {
            keyElement.classList.remove('pressed');
        }
    });
});