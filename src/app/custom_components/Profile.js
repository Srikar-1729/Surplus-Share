'use client';
import { Pencil } from 'lucide-react';
import FormInput from './FormInput';
import { useSession } from 'next-auth/react';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
// pages/index.js (or your component)




  




export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    phone: '',
    serving_cap: 0,
    account_type: '',
    latitude: null,
    longitude: null
  });
  const [originalAddress, setOriginalAddress] = useState('');
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(true);
  
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    const res = await fetch('../api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setImageUrl(data.url);
    }
  };


  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('name, address, phone, serving_cap, account_type, latitude, longitude')
        .eq('user_id', session.user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setOriginalAddress(data.address || '');
      }

      const { data: em, error: er } = await supabase
        .from('auth_users')
        .select('email')
        .eq('id', session.user.id)
        .single();

      if (!er && em) setEmail(em.email);
    }

    if (session?.user?.id) fetchProfile();
  }, [session?.user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "serving_cap") val = parseInt(value) || 0;
    setProfile((prev) => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSave = async () => {
    // Geocode address if it was changed or coordinates are missing
    let latitude = profile.latitude || null;
    let longitude = profile.longitude || null;
    
    // Re-geocode if address changed or coordinates are missing
    const addressChanged = profile.address !== originalAddress;
    if (profile.address && (addressChanged || !latitude || !longitude)) {
      try {
        const geocodeRes = await fetch('/api/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: profile.address }),
        });
        const geocodeData = await geocodeRes.json();
        if (geocodeData.success) {
          latitude = geocodeData.latitude;
          longitude = geocodeData.longitude;
        } else {
          console.warn('Geocoding failed for address:', geocodeData.error);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...profile,
        latitude,
        longitude
      })
      .eq('user_id', session.user.id);

    if (!error) {
      setDisabled(true);
      console.log('Updated successfully:', data);
      // Update local profile state with new coordinates
      setProfile(prev => ({ ...prev, latitude, longitude }));
      setOriginalAddress(profile.address);
    } else {
      console.error('Update failed:', error.message);
    }
  };

  return (
    <div className="bg-white col-span-9 row-span-6 p-7">
      <div className="flex justify-between">
        <p className="text-5xl text-bold ">Personal Details</p>
        <button
          className="border-2 border-gray-200 p-3 rounded shadow-md"
          onClick={() => setDisabled(false)}
        >
          <Pencil />
        </button>
      </div>
      <div className="grid grid-cols-2 m-5">
        <div>
          <FormInput
            name="Name"
            col="name"
            value={profile.name}
            disabled={disabled}
            onChange={handleChange}
          />
          <FormInput
            name="Email"
            col="email"
            value={email}
            disabled={true}
          />
        </div>
        <div>
          <FormInput
            name="Serving Capacity"
            col="serving_cap"
            value={profile.serving_cap}
            disabled={disabled}
            onChange={handleChange}
          />
          <FormInput
            name="Mobile Number"
            col="phone"
            value={profile.phone}
            disabled={disabled}
            onChange={handleChange}
          />
        </div>
        <div>
          <FormInput
            name="Address"
            col="address"
            value={profile.address}
            disabled={disabled}
            onChange={handleChange}
          />
        </div>
      </div>

      {!disabled && (
        <div className="flex justify-end gap-10">
          <button
            className="border-2 border-black rounded bg-red-600 text-2xl px-5 py-2"
            onClick={() => setDisabled(true)}
          >
            Cancel
          </button>
          <button
            className="border-2 border-black rounded bg-green-500 text-2xl px-7 py-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
      <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Upload Receiver Org Image</h1>
      <input type="file" onChange={handleUpload} />
      {imageUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" className="w-60 mt-2 rounded shadow" />
        </div>
      )}
    </div>
    </div>
  );
}
