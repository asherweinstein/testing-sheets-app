// API configuration
const API_URL = 'https://script.google.com/a/macros/nesbittresearch.com/s/AKfycbzwsQSh6uh7B5ChjoGq52pzgJbeGkIsrBT7GZ7F8K-oqQmxa_sFx_UFb6M3-O_C_vOJ0A/exec'; // Replace with your deployed Google Apps Script web app URL

// API functions for communicating with the backend
const api = {
    // Get all categories
    getCategories: async function() {
        try {
            const response = await fetch(`${API_URL}?action=getCategories`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },
    
    // Get subcategories for a specific category
    getSubcategories: async function(categoryId) {
        try {
            const response = await fetch(`${API_URL}?action=getSubcategories&categoryId=${categoryId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch subcategories');
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            throw error;
        }
    },
    
    // Add a new entry
    addEntry: async function(entryData) {
        try {
            // Construct URL with parameters
            const params = new URLSearchParams({
                action: 'addEntry',
                userEmail: entryData.userEmail || '',
                category: entryData.category,
                subcategory: entryData.subcategory,
                description: entryData.description,
                amount: entryData.amount,
                date: entryData.date
            });
            
            const response = await fetch(`${API_URL}?${params.toString()}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data;
            } else {
                throw new Error(data.message || 'Failed to add entry');
            }
        } catch (error) {
            console.error('Error adding entry:', error);
            throw error;
        }
    },
    
    // Get all entries
    getEntries: async function() {
        try {
            const response = await fetch(`${API_URL}?action=getEntries`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch entries');
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
            throw error;
        }
    }
};