document.addEventListener('DOMContentLoaded', function() {
  const globalPadding = 10; // Fixed padding for non-mobile
  const isMobile = window.innerWidth < 768; // Mobile-specific behavior

  // Create the tooltip element with URL and action buttons
  const createTooltip = (url) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'cyber-tooltip';
    
    const content = document.createElement('div');
    content.className = 'cyber-tooltip-content';
    
    const urlSpan = document.createElement('span');
    urlSpan.className = 'cyber-tooltip-url';
    urlSpan.textContent = url;
    
    const actions = document.createElement('div');
    actions.className = 'cyber-tooltip-actions';
    
    // Copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'cyber-tooltip-copy';
    copyButton.innerHTML = `
      <span class="material-icons-round" style="font-size: 16px">content_copy</span>
      <span>Copy</span>
    `;
    copyButton.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(url).then(() => {
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
      });
    });
    actions.appendChild(copyButton);

    // Visit button
    const visitButton = document.createElement('button');
    visitButton.className = 'cyber-tooltip-visit';
    visitButton.innerHTML = `
      <span class="material-icons-round" style="font-size: 16px">open_in_new</span>
      <span>Visit</span>
    `;
    visitButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = url;
    });
    actions.appendChild(visitButton);
    
    content.appendChild(urlSpan);
    content.appendChild(actions);
    tooltip.appendChild(content);
    return tooltip;
  };

  // Measure tooltip dimensions using a temporary clone
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

  // Calculate and set the tooltip’s position relative to its container so that it stays within the viewport.
  const checkTooltipPosition = (tooltip) => {
    return new Promise(resolve => {
      const container = tooltip.closest('.cyber-tooltip-container');
      const link = container.querySelector('a');
      
      // Get bounding rects for container and link
      const containerRect = container.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const tooltipRect = measureTooltipDimensions(tooltip);
      const viewportWidth = window.innerWidth;
      
      // Compute link's position relative to the container
      const relativeLinkLeft = linkRect.left - containerRect.left;
      // Desired left (inside container) to center tooltip over the link
      let desiredLeft = (relativeLinkLeft + (linkRect.width / 2)) - (tooltipRect.width / 2);
      
      // Convert to global coordinate for clamping
      let globalLeft = containerRect.left + desiredLeft;
      // Determine margin: 5% of viewport on mobile, or fixed padding on desktop
      const margin = isMobile ? viewportWidth * 0.05 : globalPadding;
      if (globalLeft < margin) {
        globalLeft = margin;
      }
      if (globalLeft + tooltipRect.width > viewportWidth - margin) {
        globalLeft = viewportWidth - tooltipRect.width - margin;
      }
      // Recalculate desiredLeft relative to container
      desiredLeft = globalLeft - containerRect.left;
      tooltip.style.left = desiredLeft + 'px';
      tooltip.style.transform = 'translateY(5px)';
      
      // Calculate arrow position relative to container:
      // It should point to the link’s center
      let arrowLeft = ((linkRect.left - containerRect.left) + (linkRect.width / 2)) - desiredLeft;
      arrowLeft = Math.max(10, Math.min(tooltipRect.width - 10, arrowLeft));
      tooltip.style.setProperty('--arrow-left', arrowLeft + 'px');
      
      // Flip tooltip vertically if there isn’t enough room above the link
      if ((linkRect.top - tooltipRect.height - 8) < margin) {
        tooltip.classList.add('edge-bottom');
      } else {
        tooltip.classList.remove('edge-bottom');
      }
      
      resolve();
    });
  };

  // Attach tooltips to all qualifying links
  document.querySelectorAll('a').forEach(link => {
    if (
      link.href &&
      !link.classList.contains('no-tooltip') &&
      !link.closest('.toc-container') &&
      !link.closest('.pagination') &&
      !link.closest('.summary') &&
      !link.closest('.summaries') &&
      !link.closest('.main-menu') &&
      !link.closest('.header') &&
      !link.closest('.mobile-menu') &&
      !link.closest('.menu-main-mobile')
    ) {
      const container = document.createElement('div');
      container.className = 'cyber-tooltip-container';
      
      // On mobile, prevent default link behavior so the tooltip can display
      if (isMobile) {
        link.addEventListener('click', (e) => { e.preventDefault(); });
      }
      
      link.parentNode.insertBefore(container, link);
      container.appendChild(link);
      
      const tooltip = createTooltip(link.href);
      container.appendChild(tooltip);
      
      container.addEventListener('mouseenter', async () => {
        await checkTooltipPosition(tooltip);
        tooltip.classList.add('show');
      });
      container.addEventListener('mouseleave', () => {
        tooltip.classList.remove('show');
      });
      
      // Touch behavior for devices with width below 1024px
      if (window.innerWidth < 1024) {
        container.addEventListener('touchstart', async (e) => {
          if (
            e.target.closest('.cyber-tooltip-copy') ||
            e.target.closest('.cyber-tooltip-visit')
          ) {
            return;
          }
          e.stopPropagation();
          if (!tooltip.classList.contains('show')) {
            await checkTooltipPosition(tooltip);
            tooltip.classList.add('show');
          } else {
            tooltip.classList.remove('show');
          }
        });
      }
    }
  });

  // Recalculate tooltip positions on window resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('.cyber-tooltip.show').forEach(async tooltip => {
      await checkTooltipPosition(tooltip);
      tooltip.classList.add('show');
    });
  });
});
