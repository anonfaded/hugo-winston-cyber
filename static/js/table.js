document.addEventListener('DOMContentLoaded', function() {
    const tables = document.querySelectorAll('.content table');
    
    tables.forEach(table => {
        // Create container and wrapper
        const container = document.createElement('div');
        container.className = 'table-container';
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        
        // Wrap table
        table.parentNode.insertBefore(container, table);
        wrapper.appendChild(table);
        container.appendChild(wrapper);

        // Add copy button to container (not wrapper)
        const copyBtn = document.createElement('button');
        copyBtn.className = 'table-copy-btn';
        copyBtn.innerHTML = '<span class="material-icons">content_copy</span>';
        container.appendChild(copyBtn);

        // Copy functionality
        copyBtn.addEventListener('click', async () => {
            const markdownTable = convertTableToMarkdown(table);
            try {
                await navigator.clipboard.writeText(markdownTable);
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<span class="material-icons" style="color: #98C379;">check</span>';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<span class="material-icons">content_copy</span>';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy table:', err);
            }
        });
    });

    function convertTableToMarkdown(table) {
        let markdown = [];
        const rows = table.querySelectorAll('tr');
        
        // Get headers
        const headers = rows[0].querySelectorAll('th');
        let headerRow = '|';
        let separatorRow = '|';
        
        headers.forEach(header => {
            headerRow += ` ${header.textContent.trim()} |`;
            separatorRow += ' --- |';
        });
        
        markdown.push(headerRow);
        markdown.push(separatorRow);
        
        // Get data rows
        for (let i = 1; i < rows.length; i++) {
            let rowMarkdown = '|';
            const cells = rows[i].querySelectorAll('td');
            cells.forEach(cell => {
                rowMarkdown += ` ${cell.textContent.trim()} |`;
            });
            markdown.push(rowMarkdown);
        }
        
        return markdown.join('\n');
    }
});
