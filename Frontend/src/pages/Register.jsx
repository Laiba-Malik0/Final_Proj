import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // --- FIXED: Changed /register to /signup to perfectly match your backend ---
            await axios.post('https://finalproj-production-5d78.up.railway.app/api/auth/signup', { 
                name, 
                email, 
                password 
            });

            alert("Account Created Successfully! Welcome to the squad 🏎️");
            navigate('/'); // Account bante hi direct Login page par bhej dega
        } catch (err) {
            console.log(err);
            alert("Registration Failed! Email might already exist.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4 font-sans">
            <div className="bg-zinc-900 p-8 rounded-2xl border-l-8 border-red-600 shadow-[0_0_50px_-12px_rgba(220,38,38,0.5)] w-full max-w-md text-white">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                        CAR<span className="text-red-600 underline">ZONE</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Create an account to join the showroom</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-black border border-zinc-700 p-3 rounded focus:border-red-600 outline-none transition-all text-white"
                            placeholder="Laiba Noor"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-black border border-zinc-700 p-3 rounded focus:border-red-600 outline-none transition-all text-white"
                            placeholder="yourname@carzone.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-black border border-zinc-700 p-3 rounded focus:border-red-600 outline-none transition-all text-white"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-4 rounded font-black uppercase tracking-widest italic transition-all transform hover:skew-x-2">
                        Create Account
                    </button>
                </form>

                <p className="text-center text-zinc-500 text-xs mt-6">
                    Already have an account?{' '}
                    <Link to="/" className="text-red-500 font-bold hover:underline">
                        Login Here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;