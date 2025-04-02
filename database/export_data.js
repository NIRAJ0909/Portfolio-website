const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio'
});

// Function to export data
async function exportData() {
    const outputPath = path.join(__dirname, '..', 'database_data.txt');
    let output = 'DATABASE EXPORT\n';
    output += '================\n\n';

    // Export Messages
    db.query('SELECT * FROM messages ORDER BY created_at DESC', (err, messages) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return;
        }

        output += 'MESSAGES\n';
        output += '--------\n';
        messages.forEach(msg => {
            output += `ID: ${msg.id}\n`;
            output += `Name: ${msg.name}\n`;
            output += `Email: ${msg.email}\n`;
            output += `Message: ${msg.message}\n`;
            output += `Created: ${msg.created_at}\n`;
            output += '-------------------\n';
        });

        // Export Projects
        db.query('SELECT * FROM projects ORDER BY created_at DESC', (err, projects) => {
            if (err) {
                console.error('Error fetching projects:', err);
                return;
            }

            output += '\nPROJECTS\n';
            output += '--------\n';
            projects.forEach(proj => {
                output += `ID: ${proj.id}\n`;
                output += `Title: ${proj.title}\n`;
                output += `Category: ${proj.category}\n`;
                output += `Description: ${proj.description}\n`;
                output += `Image URL: ${proj.image_url}\n`;
                output += `Created: ${proj.created_at}\n`;
                output += '-------------------\n';
            });

            // Write to file
            fs.writeFileSync(outputPath, output);
            console.log(`Data exported to ${outputPath}`);
            process.exit();
        });
    });
}

// Run the export
exportData();