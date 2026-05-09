import { supabase } from '../config/supabase.js';
// GET /api/items
export async function getAllItems(_req, res, next) {
try {
const { data, error } = await supabase
.from('items')
.select('*')
.order('created_at', { ascending: false });
if (error) throw error;
res.json(data);
} catch (err) { next(err); }
}
// GET /api/items/:id
export async function getItemById(req, res, next) {
try {
const { data, error } = await supabase
.from('items').select('*').eq('id', req.params.id).single();
if (error || !data)
return res.status(404).json({ error: 'Item not found.' });
res.json(data);
} catch (err) { next(err); }
}
// POST /api/items (admin only)
export async function createItem(req, res, next) {
try {
const { title, description, category, image_url } = req.body;
if (!title)
return res.status(400).json({ error: 'Title is required.' });
const { data, error } = await supabase
.from('items')
.insert({ title, description, category, image_url, created_by: req.user.id })
.select().single();
if (error) throw error;
res.status(201).json(data);
} catch (err) { next(err); }
}
// PUT /api/items/:id (admin only)
export async function updateItem(req, res, next) {
try {
const { title, description, category, image_url } = req.body;
const { data, error } = await supabase
.from('items')
.update({ title, description, category, image_url,
updated_at: new Date().toISOString() })
.eq('id', req.params.id)
.select().single();
if (error || !data)
return res.status(404).json({ error: 'Item not found.' });
res.json(data);
} catch (err) { next(err); }
}
// DELETE /api/items/:id (admin only)
export async function deleteItem(req, res, next) {
try {
const { error } = await supabase
.from('items').delete().eq('id', req.params.id);
if (error) throw error;
res.status(204).send();
} catch (err) { next(err); }
}