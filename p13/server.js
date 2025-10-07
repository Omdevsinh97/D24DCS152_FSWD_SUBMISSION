
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to display the form
app.get('/', (req, res) => {
    res.render('index', { totalIncome: null, error: null });
});

// Route to handle form submission
app.post('/calculate', (req, res) => {
    const { income1, income2 } = req.body;

    // Validate input
    if (isNaN(income1) || isNaN(income2) || income1 === '' || income2 === '') {
        return res.render('index', { totalIncome: null, error: 'Please enter valid numbers for both incomes.' });
    }

    const totalIncome = parseFloat(income1) + parseFloat(income2);
    res.render('result', { totalIncome, income1, income2 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
