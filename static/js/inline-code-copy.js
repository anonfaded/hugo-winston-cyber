document.addEventListener('DOMContentLoaded', function() {
    const globalPadding = 10; // Fixed padding for desktop
    const isMobile = window.innerWidth < 768; // Mobile-specific behavior

    // Utility: measure tooltip dimensions using a temporary clone (to avoid animation timing issues)
    const measureTooltipDimensions = (tooltip) => {
        const clone = tooltip.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.opacity = '1';
        clone.style.transition = 'none';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);
        const rect = clone.getBoundingClientRect();
        document.body.removeChild(clone);
        return rect;
    };

    // Compute and set the tooltip’s position so it stays within the viewport.
    // 'wrapper' is the container wrapping the inline code element,
    // 'code' is the inline code element itself.
    const checkCodeTooltipPosition = (tooltip, wrapper, code) => {
        return new Promise(resolve => {
            const containerRect = wrapper.getBoundingClientRect();
            const codeRect = code.getBoundingClientRect();
            const tooltipRect = measureTooltipDimensions(tooltip);
            const viewportWidth = window.innerWidth;
            
            // Calculate the code element's left relative to its container
            const relativeCodeLeft = codeRect.left - containerRect.left;
            // Desired left (inside container) to center tooltip over the inline code element
            let desiredLeft = (relativeCodeLeft + (codeRect.width / 2)) - (tooltipRect.width / 2);
            
            // Convert to a global left coordinate for clamping
            let globalLeft = containerRect.left + desiredLeft;
            const margin = isMobile ? viewportWidth * 0.05 : globalPadding;
            if (globalLeft < margin) {
                globalLeft = margin;
            }
            if (globalLeft + tooltipRect.width > viewportWidth - margin) {
                globalLeft = viewportWidth - tooltipRect.width - margin;
            }
            // Recalculate desiredLeft relative to the container
            desiredLeft = globalLeft - containerRect.left;
            tooltip.style.left = desiredLeft + 'px';
            tooltip.style.transform = 'translateY(5px)';
            
            // Compute the arrow’s horizontal offset relative to the container:
            // It should point to the inline code element’s center.
            let arrowLeft = ((codeRect.left - containerRect.left) + (codeRect.width / 2)) - desiredLeft;
            arrowLeft = Math.max(10, Math.min(tooltipRect.width - 10, arrowLeft));
            tooltip.style.setProperty('--arrow-left', arrowLeft + 'px');
            
            // Flip tooltip vertically if there isn’t enough room above the inline code element.
            if ((codeRect.top - tooltipRect.height - 8) < margin) {
                tooltip.classList.add('edge-bottom');
            } else {
                tooltip.classList.remove('edge-bottom');
            }
            
            resolve();
        });
    };

    // Process each inline code element
    const inlineCodes = document.querySelectorAll('.content p code, .content li code, .content td code');

    inlineCodes.forEach(code => {
        // Wrap the inline code element
        const wrapper = document.createElement('div');
        wrapper.className = 'code-tooltip-wrapper';
        code.parentNode.insertBefore(wrapper, code);
        wrapper.appendChild(code);

        // Create the tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'code-tooltip';
        
        const content = document.createElement('div');
        content.className = 'code-tooltip-content';
        content.textContent = code.textContent.trim();
        
        const actions = document.createElement('div');
        actions.className = 'code-tooltip-actions';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'code-tooltip-copy';
        copyButton.innerHTML = `
            <span class="material-icons-round" style="font-size: 16px">content_copy</span>
            <span>Copy</span>
        `;
        actions.appendChild(copyButton);
        tooltip.appendChild(content);
        tooltip.appendChild(actions);
        wrapper.appendChild(tooltip);

        // Show/hide tooltip (mouseenter triggers recalculation of position)
        wrapper.addEventListener('mouseenter', async () => {
            await checkCodeTooltipPosition(tooltip, wrapper, code);
            tooltip.classList.add('show');
        });
        
        wrapper.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });

        // Copy functionality
        copyButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(code.textContent.trim());
                copyButton.innerHTML = `
                    <span class="material-icons-round" style="font-size: 16px">check</span>
                    <span>Copied</span>
                `;
                copyButton.classList.add('copied');
                setTimeout(() => {
                    copyButton.innerHTML = `
                        <span class="material-icons-round" style="font-size: 16px">content_copy</span>
                        <span>Copy</span>
                    `;
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // Recalculate positions on window resize
    window.addEventListener('resize', () => {
        document.querySelectorAll('.code-tooltip.show').forEach(async tooltip => {
            const wrapper = tooltip.closest('.code-tooltip-wrapper');
            const code = wrapper.querySelector('code');
            await checkCodeTooltipPosition(tooltip, wrapper, code);
            tooltip.classList.add('show');
        });
    });
});
