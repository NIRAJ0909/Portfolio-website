const mongoose = require('mongoose');

// Define your schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Function to save data
async function saveContact(data) {
    const contact = new Contact(data);
    try {
        await contact.save();
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Example data
const contactData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message.',
};

// Call the function to save data
saveContact(contactData);