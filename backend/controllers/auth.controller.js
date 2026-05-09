import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
const SALT_ROUNDS = 12;
// POST /api/auth/signup
export async function signup(req, res, next) {
try {
const { name, email, password } = req.body;
if (!name || !email || !password)
return res.status(400).json({ error: 'All fields are required.' });
if (password.length < 8)
return res.status(400).json({ error: 'Password must be at least 8 characters.' });
// Check duplicate email
const { data: existing } = await supabase
.from('users').select('id').eq('email', email).single();
if (existing)
return res.status(409).json({ error: 'Email already registered.' });
// HASH the password — never store plain text!
const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
const { data: user, error } = await supabase
.from('users')
.insert({ name, email, password_hash: passwordHash })
.select('id, name, email, role, created_at')
.single();
if (error) throw error;
const token = generateToken(user);
res.status(201).json({ user, token });
} catch (err) { next(err); }
}
// POST /api/auth/login
export async function login(req, res, next) {
try {
const { email, password } = req.body;
if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });
const { data: user, error } = await supabase
.from('users')
.select('id, name, email, role, password_hash, created_at')
.eq('email', email)
.single();
if (error || !user)
return res.status(401).json({ error: 'Invalid email or password.' });
// Compare submitted password against stored hash
const valid = await bcrypt.compare(password, user.password_hash);
if (!valid)
return res.status(401).json({ error: 'Invalid email or password.' });
const { password_hash, ...safeUser } = user;
const token = generateToken(safeUser);
res.json({ user: safeUser, token });
} catch (err) { next(err); }
}
// GET /api/auth/me (protected)
export async function getMe(req, res) {
res.json({ user: req.user });
}
function generateToken(user) {
return jwt.sign(
{ id: user.id, email: user.email, role: user.role },
process.env.JWT_SECRET,
{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);
}