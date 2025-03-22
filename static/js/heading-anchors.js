document.addEventListener('DOMContentLoaded', function() {
    // Select all headings in the content area
    const headings = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6');
    
    headings.forEach(function(heading) {
        // Skip if heading already has an id
        if (!heading.id) {
            // Create an id from the heading text
            heading.id = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        
        // Create the anchor link
        const anchor = document.createElement('a');
        anchor.className = 'heading-anchor';
        anchor.href = '#' + heading.id;
        // Ship's anchor icon
        anchor.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z"/></svg>';
        
        // Insert the anchor before the heading content
        heading.insertBefore(anchor, heading.firstChild);
    });
}); 