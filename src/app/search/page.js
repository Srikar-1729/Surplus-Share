'use client'

import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "../lib/supabaseClient";



// Helper: Geocode address only if coordinates are not stored (fallback)
async function geocodeAddress(address) {
    if (!address) return null;
    try {
        const response = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
        });
        const data = await response.json();
        if (data.success) {
            return { lat: data.latitude, lng: data.longitude };
        }
        return null;
    } catch (e) {
        return null;
    }
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    // Returns distance in km between two lat-lng points
    function toRad(x) { return (x * Math.PI) / 180; }
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Card with distance based on donation pickup address to orphanage
function OrphanageCard({ profile, distance, donationAddress }) {
    const [pickupToOrphanageDistance, setPickupToOrphanageDistance] = useState(null);

    useEffect(() => {
        async function computeDistance() {
            if (!donationAddress || !profile) {
                setPickupToOrphanageDistance(null);
                return;
            }
            
            // Use stored coordinates for orphanage if available
            let orphanageLoc = null;
            if (profile.latitude && profile.longitude) {
                orphanageLoc = { lat: profile.latitude, lng: profile.longitude };
            } else if (profile.address) {
                // Fallback to geocoding if coordinates not stored
                orphanageLoc = await geocodeAddress(profile.address);
            }
            
            // Geocode donation pickup address (donations don't have stored coordinates)
            const pickupLoc = donationAddress ? await geocodeAddress(donationAddress) : null;
            
            if (!pickupLoc || !orphanageLoc) {
                setPickupToOrphanageDistance(null);
            } else {
                const d = haversineDistance(
                    pickupLoc.lat,
                    pickupLoc.lng,
                    orphanageLoc.lat,
                    orphanageLoc.lng
                );
                setPickupToOrphanageDistance(d);
            }
        }
        computeDistance();
        // Only run if donationAddress or profile changes
    }, [donationAddress, profile]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 border">
            <div className="text-2xl font-semibold text-blue-700 mb-1">{profile.name}</div>
            <div className="text-sm text-gray-500 mb-2">{profile.account_type ? profile.account_type : "Orphanage"}</div>
            <div className="flex flex-col gap-1">
                <span className="text-gray-700"><span className="font-medium">Address:</span> {profile.address || "Not Provided"}</span>
                <span className="text-gray-700"><span className="font-medium">Phone:</span> {profile.phone || "Not Provided"}</span>
                <span className="text-gray-700"><span className="font-medium">Serving Capacity:</span> {profile.serving_cap ?? "Not Provided"}</span>
            </div>
            {(typeof distance === "number" && isFinite(distance)) && (
                <div className="text-xs text-gray-600 mt-1">
                    User→Orphanage Distance: {distance.toFixed(2)} km
                </div>
            )}
            {pickupToOrphanageDistance !== null && (
                <div className="text-xs text-gray-500 mt-1">
                    Donation Pickup→Orphanage Distance: {pickupToOrphanageDistance.toFixed(2)} km
                </div>
            )}
        </div>
    );
}

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("distance"); // or "serving_cap"
    const [userLocation, setUserLocation] = useState(null);

    // Fetch all orphanages (user_profiles where account_type = 'orphanage')
    useEffect(() => {
        fetchOrphanages();
        getUserLocation();
    }, []);

    // Geolocation for user
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    setUserLocation(null);
                }
            );
        } else {
            setUserLocation(null);
        }
    };

    // Fetch orphanage profiles
    const fetchOrphanages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("account_type", "orphanage");

            if (error) {
                console.error("Error fetching orphanages:", error);
                setProfiles([]);
                return;
            }
            setProfiles(data || []);
        } catch (e) {
            console.error("Error fetching orphanages:", e);
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    };

    // Get coordinates from profile - use stored coordinates if available, otherwise fallback
    const getLocation = (profile) => {
        // First try stored coordinates
        if (profile.latitude && profile.longitude) {
            return {
                lat: profile.latitude,
                lng: profile.longitude
            };
        }
        // Fallback: Parse address into coordinates (not accurate, for demo only)
        if (!profile.address) return null;
        const hash = profile.address.split("").reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        // Randomly spread in Bangalore region for demo (change as per your region as needed)
        return {
            lat: 12.9716 + (hash % 100) / 1000,
            lng: 77.5946 + (hash % 100) / 1000
        };
    };

    // Haversine formula
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        if (!lat1 || !lng1 || !lat2 || !lng2) return Infinity;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Filtering and sorting
    const filteredAndSortedProfiles = useMemo(() => {
        let filtered = profiles;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(profile =>
                profile.name?.toLowerCase().includes(query) ||
                profile.address?.toLowerCase().includes(query) ||
                profile.phone?.toLowerCase().includes(query) ||
                (profile.account_type?.toLowerCase().includes(query))
            );
        }

        // Attach distance using stored coordinates
        const profilesWithDistance = filtered.map(profile => {
            const coords = getLocation(profile);
            let distance = Infinity;
            if (userLocation && coords) {
                distance = calculateDistance(userLocation.lat, userLocation.lng, coords.lat, coords.lng);
            }
            return { ...profile, distance };
        });

        // Sort by distance or serving capacity
        return profilesWithDistance.sort((a, b) => {
            if (sortBy === "distance") {
                return a.distance - b.distance;
            } else if (sortBy === "serving_cap") {
                // Higher serving capacity first
                const aCap = a.serving_cap ?? 0;
                const bCap = b.serving_cap ?? 0;
                return bCap - aCap;
            }
            return 0;
        });
    }, [profiles, searchQuery, sortBy, userLocation]);

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Search Bar Section */}
            <div className="sticky top-14 z-10 bg-amber-100 shadow-md pt-6 pb-4">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="relative mb-4">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search orphanage by name, address, phone, or type..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 py-3 text-lg w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="flex max-w-7xl px-5 mt-12 py-6 gap-6">
                {/* Filter Sidebar */}
                <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit sticky top-40">
                    <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal className="w-5 h-5" />
                        <h2 className="text-2xl font-semibold">Filters</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-lg font-medium mb-2 block">Sort By</Label>
                            <RadioGroup value={sortBy} onValueChange={setSortBy}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value="distance" id="sort-distance" />
                                    <Label htmlFor="sort-distance" className="cursor-pointer">Distance (Nearest)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="serving_cap" id="sort-serving-cap" />
                                    <Label htmlFor="sort-serving-cap" className="cursor-pointer">Serving Capacity (Highest)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-600">
                                {filteredAndSortedProfiles.length} orphanage{filteredAndSortedProfiles.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                    </div>
                </div>
                {/* Results Section */}
                <div className="flex-1">
                    {loading ? (
                        <div className="text-center py-20">
                            <p className="text-2xl text-gray-600">Loading orphanages...</p>
                        </div>
                    ) : filteredAndSortedProfiles.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-2xl text-gray-600">No orphanages found</p>
                            <p className="text-lg text-gray-500 mt-2">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAndSortedProfiles.map(profile => (
                                <OrphanageCard
                                    key={profile.user_id}
                                    profile={profile}
                                    distance={profile.distance}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}