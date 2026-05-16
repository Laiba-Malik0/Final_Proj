/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null); 
  const [selectedCar, setSelectedCar] = useState(null); 
  const [viewMode, setViewMode] = useState('all'); 
  const [newCar, setNewCar] = useState({ name: '', model: '', price: '', image: null });
  
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.id;

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCars();
  }, []); 

  const displayCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const carOwnerId = car.createdBy?._id || car.createdBy;
    const matchesMode = viewMode === 'all' ? true : carOwnerId === userId;

    return matchesSearch && matchesMode;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const openEditModal = (car) => {
    setEditingCarId(car._id);
    setNewCar({ name: car.name, model: car.model, price: car.price, image: null });
    setIsModalOpen(true);
  };

  const handleAddOrUpdateCar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', newCar.name);
      formData.append('model', newCar.model);
      formData.append('price', Number(newCar.price || 0));
      if (newCar.image) formData.append('image', newCar.image);

      const config = { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };

      if (editingCarId) {
        await axios.put(`http://localhost:5000/api/cars/${editingCarId}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/cars', formData, config);
      }
      
      setIsModalOpen(false);
      setEditingCarId(null);
      setNewCar({ name: '', model: '', price: '', image: null });
      fetchCars(); 
    } catch (error) {
      alert("Action failed!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this beast?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCars(); 
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-black animate-pulse text-2xl uppercase italic tracking-widest">Entering CarZone...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">
      
      {/* --- FIXED NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-zinc-800 p-4 md:p-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-black/80 backdrop-blur-xl">
        <h1 className="text-2xl md:text-3xl font-black italic text-red-600 tracking-tighter">CAR<span className="text-white">ZONE</span></h1>
        
        <div className="flex bg-zinc-900/50 p-1 rounded-full border border-zinc-800 text-xs font-bold">
          <button onClick={() => setViewMode('all')} className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full transition-all ${viewMode === 'all' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'text-zinc-500 hover:text-white'}`}>All Fleet</button>
          <button onClick={() => setViewMode('my')} className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full transition-all ${viewMode === 'my' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'text-zinc-500 hover:text-white'}`}>My Garage</button>
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button onClick={() => { setEditingCarId(null); setNewCar({name:'', model:'', price:'', image:null}); setIsModalOpen(true); }} className="flex-1 sm:flex-none text-center bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-bold transition-all text-xs active:scale-95">+ Add New</button>
          <button onClick={handleLogout} className="flex-1 sm:flex-none text-center border border-zinc-700 hover:bg-zinc-800 px-5 py-2 rounded-full font-bold transition text-xs">Logout</button>
        </div>
      </nav>

      {/* --- MAIN CONTENT (Ensured huge margin-top breakout so fixed nav never chokes it) --- */}
      <main className="mt-48 sm:mt-32 p-4 md:p-8 max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADING & STATS LAYOUT (Clean and clear of any absolute overlap) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="w-full md:w-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase italic tracking-tighter leading-none mb-4 text-white">
              {viewMode === 'all' ? 'Available' : 'Personal'} <span className="text-zinc-700">Fleet</span>
            </h2>
            <input type="text" placeholder="Search..." className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl w-full md:w-80 outline-none focus:border-red-600 transition-all text-sm text-white" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="text-right border-r-4 border-red-600 pr-4 self-end md:self-auto">
            <span className="text-red-600 text-4xl md:text-5xl font-black leading-none block tracking-tighter">{displayCars.length.toString().padStart(2, '0')}</span>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Units Found</p>
          </div>
        </div>

        {/* --- CARS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayCars.map((car) => {
            const carOwnerId = car.createdBy?._id || car.createdBy;
            const isMyCar = carOwnerId === userId;

            return (
              <div key={car._id} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden transition-all duration-500 group relative hover:-translate-y-1 md:hover:-translate-y-2 hover:border-red-600/50 hover:shadow-[0_20px_40px_rgba(220,38,38,0.2)]">
                
                {isMyCar && (
                  <div className="absolute top-4 left-4 z-20 flex gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(car._id); }} className="bg-black/60 hover:bg-red-600 p-2.5 rounded-full border border-white/10 hover:scale-110 active:scale-95 transition-all">🗑️</button>
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(car); }} className="bg-black/60 hover:bg-blue-600 p-2.5 rounded-full border border-white/10 hover:scale-110 active:scale-95 transition-all">✏️</button>
                  </div>
                )}

                <div className="h-44 md:h-48 bg-zinc-800 overflow-hidden relative">
                  <img src={car.image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70"} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent"></div>
                </div>

                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-black uppercase italic truncate group-hover:text-red-500 transition-colors duration-300">{car.name}</h3>
                  <p className="text-zinc-500 mb-4 font-bold text-[10px] uppercase tracking-widest">Model: {car.model}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800/80">
                    <p className="text-xl md:text-2xl font-black text-white italic">
                      <span className="text-red-600 text-xs font-bold mr-1">Rs.</span>
                      {Number(car.price || 0).toLocaleString()}
                    </p>
                    <button onClick={() => setSelectedCar(car)} className="h-9 w-9 md:h-10 md:w-10 bg-white text-black hover:bg-red-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl hover:translate-x-1 active:scale-90">→</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- CAR DETAILS MODAL --- */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-[2rem] md:rounded-[2.5rem] max-w-2xl w-full relative overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_0_100px_rgba(220,38,38,0.1)] animate-[zoomIn_0.4s_ease-out-back] my-auto">
            <button onClick={() => setSelectedCar(null)} className="absolute top-4 right-4 bg-zinc-900 hover:bg-red-600 text-white w-9 h-9 md:w-10 md:h-10 rounded-full font-bold z-50 border border-zinc-800 flex items-center justify-center transition-all hover:rotate-90">✕</button>

            <div className="h-48 sm:h-64 md:h-full relative overflow-hidden">
              <img src={selectedCar.image} className="w-full h-full object-cover animate-[imageZoom_10s_infinite_alternate]" alt={selectedCar.name} />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-transparent"></div>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between bg-zinc-950 gap-6">
              <div>
                <span className="text-red-600 text-[9px] md:text-[10px] uppercase font-black tracking-widest bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">Hyper Spec</span>
                <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tighter mt-3 mb-1 break-words">{selectedCar.name}</h2>
                <p className="text-zinc-500 font-bold text-xs uppercase mb-4 md:mb-6 tracking-widest">Model: <span className="text-white">{selectedCar.model}</span></p>

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {['Engine: V8 Twin', 'Speed: 320 KM/H', 'AWD System', 'Octane 97'].map((spec, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-900 p-2 md:p-2.5 rounded-xl text-[9px] md:text-[10px] font-black italic uppercase text-zinc-400 truncate">{spec}</div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center gap-2">
                <div className="truncate">
                  <span className="text-zinc-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">Valuation</span>
                  <p className="text-xl md:text-3xl font-black text-white italic leading-none mt-1 truncate"><span className="text-red-600 text-xs md:text-sm font-bold">Rs.</span>{Number(selectedCar.price || 0).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedCar(null)} className="bg-red-600 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-black uppercase italic text-xs hover:bg-white hover:text-black transition-all whitespace-nowrap">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT FORM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center z-[200] p-0 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-900 border-t sm:border border-zinc-800 p-6 md:p-8 rounded-t-[2rem] sm:rounded-[2.5rem] w-full max-w-md animate-[slideUp_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-black italic mb-5 md:mb-6 uppercase">{editingCarId ? 'Update' : 'New'} <span className="text-red-600">Entry</span></h2>
            <form onSubmit={handleAddOrUpdateCar} className="space-y-4">
              <input type="text" placeholder="Car Model Name" value={newCar.name} className="w-full bg-zinc-800/50 border border-zinc-800 p-3.5 rounded-2xl text-white outline-none focus:border-red-600 transition-all text-sm" onChange={(e) => setNewCar({...newCar, name: e.target.value})} required />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Year" value={newCar.model} className="w-full bg-zinc-800/50 border border-zinc-800 p-3.5 rounded-2xl text-white outline-none focus:border-red-600 transition-all text-sm" onChange={(e) => setNewCar({...newCar, model: e.target.value})} required />
                <input type="number" placeholder="PKR Price" value={newCar.price} className="w-full bg-zinc-800/50 border border-zinc-800 p-3.5 rounded-2xl text-white outline-none focus:border-red-600 transition-all text-sm" onChange={(e) => setNewCar({...newCar, price: e.target.value})} required />
              </div>
              
              <div className="p-3.5 border-2 border-dashed border-zinc-800 rounded-2xl hover:border-red-600 transition-colors bg-zinc-800/20 group text-center">
                <input type="file" accept="image/*" id="file-upload" className="hidden" onChange={(e) => setNewCar({...newCar, image: e.target.files[0]})} required={!editingCarId} />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-1">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest group-hover:text-red-500 transition-colors">Select Car Image</span>
                  <span className="text-[10px] text-zinc-600 max-w-[250px] truncate">{newCar.image ? newCar.image.name : 'No file selected'}</span>
                </label>
              </div>

              <div className="flex gap-3 md:gap-4 mt-6">
                <button type="submit" className="flex-[2] bg-red-600 py-3.5 rounded-2xl font-black uppercase italic hover:bg-red-700 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] text-xs md:text-sm">Confirm</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 py-3.5 rounded-2xl font-black uppercase italic hover:bg-zinc-700 transition-all text-xs md:text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM KEYFRAMES */}
      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8) rotate(-2deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes imageZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;