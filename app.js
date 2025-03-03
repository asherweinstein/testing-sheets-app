// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory');
    const entryForm = document.getElementById('entry-form');
    const submitMessage = document.getElementById('submit-message');
    const entriesTable = document.getElementById('entries-table').querySelector('tbody');
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // Initialize the application
    initApp();
    
    // Event Listeners
    categorySelect.addEventListener('change', handleCategoryChange);
    entryForm.addEventListener('submit', handleFormSubmit);
    
    // Initialize the app
    async function initApp() {
        try {
            // Load categories
            await loadCategories();
            
            // Load recent entries
            await loadEntries();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            showMessage('Error initializing application. Please refresh and try again.', false);
        }
    }
    
    // Load categories into select dropdown
    async function loadCategories() {
        try {
            const categories = await api.getCategories();
            
            // Clear existing options (except the first one)
            categorySelect.innerHTML = '<option value="">Select a category</option>';
            
            // Add new options
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            showMessage('Failed to load categories. Please refresh the page.', false);
        }
    }
    
    // Handle category change
    async function handleCategoryChange() {
        const categoryId = categorySelect.value;
        
        // Clear and disable subcategory select if no category is selected
        if (!categoryId) {
            subcategorySelect.innerHTML = '<option value="">Select a subcategory</option>';
            subcategorySelect.disabled = true;
            return;
        }
        
        try {
            // Load subcategories for selected category
            const subcategories = await api.getSubcategories(categoryId);
            
            // Enable and clear subcategory select
            subcategorySelect.disabled = false;
            subcategorySelect.innerHTML = '<option value="">Select a subcategory</option>';
            
            // Add new options
            subcategories.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory.id;
                option.textContent = subcategory.name;
                subcategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading subcategories:', error);
            showMessage('Failed to load subcategories.', false);
        }
    }
    
    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const formData = {
            userEmail: '', // You can add user authentication later
            category: document.getElementById('category').options[document.getElementById('category').selectedIndex].text,
            subcategory: document.getElementById('subcategory').options[document.getElementById('subcategory').selectedIndex].text,
            description: document.getElementById('description').value,
            amount: document.getElementById('amount').value,
            date: document.getElementById('date').value
        };
        
        try {
            // Submit data to API
            const result = await api.addEntry(formData);
            
            // Show success message
            showMessage('Entry added successfully!', true);
            
            // Clear form
            entryForm.reset();
            document.getElementById('date').valueAsDate = new Date();
            subcategorySelect.disabled = true;
            
            // Reload entries
            await loadEntries();
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('Failed to submit entry. Please try again.', false);
        }
    }
    
    // Load and display entries
    async function loadEntries() {
        try {
            const entries = await api.getEntries();
            
            // Clear existing entries
            entriesTable.innerHTML = '';
            
            // Sort entries by timestamp in descending order (newest first)
            entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Take only the 10 most recent entries
            const recentEntries = entries.slice(0, 10);
            
            // Add entries to table
            recentEntries.forEach(entry => {
                const row = document.createElement('tr');
                
                // Format the date
                const entryDate = new Date(entry.date);
                const formattedDate = entryDate.toLocaleDateString();
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${entry.category}</td>
                    <td>${entry.subcategory}</td>
                    <td>${entry.description}</td>
                    <td>${parseFloat(entry.amount).toFixed(2)}</td>
                `;
                
                entriesTable.appendChild(row);
            });
            
            // Show message if no entries
            if (recentEntries.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="5" style="text-align: center;">No entries yet</td>';
                entriesTable.appendChild(row);
            }
        } catch (error) {
            console.error('Error loading entries:', error);
            
            // Show message in table
            entriesTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load entries</td></tr>';
        }
    }
    
    // Show message to user
    function showMessage(text, isSuccess) {
        submitMessage.textContent = text;
        submitMessage.className = isSuccess ? 'message success' : 'message error';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            submitMessage.className = 'message hidden';
        }, 5000);
    }
});