import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { userServiceUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaStore, FaUtensilSpoon } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import FoodCard from '../components/FoodCard'

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  const handleShop = async () => {
    try {
      const result = await axios.get(`${userServiceUrl}/api/v1/category/get-item-by-shop/${shopId}`, {
        withCredentials: true
      });

      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-500">
        Shop not found.
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
        <button className='absolute top-4 text-white left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 px-3 py-2
        rounded-full shadow transition' onClick={()=>navigate("/")}>
            <span><FaArrowLeft/></span>
        </button>
      <div className='relative w-full h-64 md:h-80 lg:h-96'>

        <img src={shop.image} alt="Shop Banner"
          className='w-full h-full object-cover'
        />

        <div className='absolute inset-0 bg-linear-to-b from-black/70 to-black/30
          flex flex-col justify-center items-center text-center px-4'>

          <FaStore className='text-white text-4xl mb-3 drop-shadow-md' />

          <h1 className='text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg'>
            {shop.name}
          </h1>
        <div className='flex items-center gap-10px'>
            <FaLocationDot size={22} color="red"/>
          <p className='text-lg font-medium text-white mt-2.5'>
            {shop.address}
          </p>
        </div>
        </div>
      </div>

      {/* Items section (optional) */}
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <h2 className='flex items-center justify-center gap-3 text-xl font-semibold mb-4 text-gray-800'><FaUtensilSpoon color="red"/>Our Menu's</h2>
        {items.length === 0 ? (
          <p className='text-center text-gray-500 text-lg'>No items available.</p>
        ) : (
          <div className='flex flex-wrap justfy-center gap-8'>
            {items.map((item) => (
             <FoodCard data={item}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
