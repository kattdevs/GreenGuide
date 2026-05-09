import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
// Verify JWT and attach the user object to req.user
export async function protect(req, res, next) {
try {
const header = req.headers.authorization;
if (!header || !header.startsWith('Bearer '))
return res.status(401).json({ error: 'No token provided.' });
const token = header.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Re-fetch user so role changes take effect immediately
const { data: user, error } = await supabase
.from('users')
.select('id, name, email, role')
.eq('id', decoded.id)
.single();
if (error || !user)
return res.status(401).json({ error: 'User not found.' });
req.user = user;
next();
} catch (err) {
if (err.name === 'TokenExpiredError')
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
return res.status(401).json({ error: 'Invalid token.' });
}
}
// Only allows users whose role === 'admin'
export function adminOnly(req, res, next) {
if (req.user?.role !== 'admin')
return res.status(403).json({ error: 'Forbidden: Admin access required.' });
next();
}