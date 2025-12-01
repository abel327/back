const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

// CORS
app.use(cors({
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}));

// Logs
app.use(morgan('combined'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Supabase client
const supabase = supabaseClient.createClient(
    'https://rmemmldcvvhslkylzfbo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZW1tbGRjdnZoc2xreWx6ZmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTQwMDYsImV4cCI6MjA3OTU5MDAwNn0.1WrHsMBilZsDvQxru56x0IWU9oMPY3vzFQnsRM3JHf4'
);


app.get('/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select();
    if (error) return res.status(500).json({ error });
    return res.json(data);
});


app.get('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(404).json({ error: "Produto não encontrado" });
    return res.json(data);
});


app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;

    const { data, error } = await supabase
        .from('products')
        .insert({ name, description, price })
        .select();

    if (error) return res.status(400).json({ error });

    return res.status(201).json({
        message: "Produto criado com sucesso!",
        data
    });
});


app.put('/products/:id', async (req, res) => {
    const { name, description, price } = req.body;

    const { data, error } = await supabase
        .from('products')
        .update({ name, description, price })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(400).json({ error });

    return res.json({
        message: "Produto atualizado com sucesso!",
        data
    });
});


app.delete('/products/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(400).json({ error });

    return res.json({ message: "Produto deletado com sucesso!" });
});


app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

//app.get('*', (req, res) => {
//    res.send("Hello again I am working my friend to the moon and behind <3");
//});

app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});