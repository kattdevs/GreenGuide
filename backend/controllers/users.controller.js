import { supabase } from '../config/supabase.js';
// GET /api/users (admin only)
export async function getAllUsers(_req, res, next) {
try {
const { data, error } = await supabase
.from('users')
.select('id, name, email, role, created_at')
.order('created_at', { ascending: false });
if (error) throw error;
res.json(data);
} catch (err) { next(err); }
}
// PATCH /api/users/:id/role (admin only)
export async function updateUserRole(req, res, next) {
try {
const { role } = req.body;
if (!['user', 'admin'].includes(role))
return res.status(400).json({ error: 'Role must be "user" or "admin".' });
const { data, error } = await supabase
.from('users')
.update({ role })
.eq('id', req.params.id)
.select('id, name, email, role')
.single();
if (error || !data)
return res.status(404).json({ error: 'User not found.' });
res.json(data);
} catch (err) { next(err); }
}