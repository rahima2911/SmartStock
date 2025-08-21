'use client';
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="bg-black text-gray-400 h-screen w-64 flex flex-col  py-15">
      <div className="px-7">
      {/* Profile Image */}
      <div className="relative">
        <Image
          src="/profile.jpg" // apni image public folder me daal ke yaha name change karo
          alt="Profile"
          width={50}
          height={80}
          className="rounded-md object-cover"
        />
        
      
      </div>

      {/* Name and Email */}
      <h2 className="mt-4 text-lg text-white font-semibold">Samantha</h2>
      <p className="text-sm text-gray-400">samantha@email.com</p>
</div>
      {/* Menu Items */}
      <nav className="mt-17 w-full">
        <ul className="space-y-4">
          <li className="px-8">
            <span className="hover:text-white cursor-pointer">Dashboard</span>
          </li>
          <li className="px-8">
            <Link href="/" className="text-white font-semibold">
              Expenses
            </Link>
          </li>
          <li className="px-8">
            <Link href="/products" className="text-white font-semibold">
              Products
            </Link>
          </li>
          <li className="px-8">
            <Link href="/addStock" className="text-white font-semibold">
              Add Stock
            </Link>
          </li>
          <li className="px-8">
            <Link href="/removeStock" className="text-white font-semibold">
              Remove Stock
            </Link>
          </li>
          <li className="px-8">
            <Link href="/inventories" className="text-white font-semibold">
              inventories
            </Link>
          </li>
          
          <li className="px-8">
            <span className="hover:text-white cursor-pointer">Settings</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}
