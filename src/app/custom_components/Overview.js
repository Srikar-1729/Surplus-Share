import { Package, Users} from 'lucide-react';
export default function Overview(){
    return(
        <>
           
            <div className="col-span-6 row-span-5 bg-white  rounded shadow-md border-2 border-gray-200">
            <p className="text-4xl p-5">Recent Donations</p>
            
            </div>
             <div className="col-span-3 row-span-2 bg-white  rounded shadow-md border-2 border-gray-200">
                <div className="flex gap-2 p-5">
                    
                    <Package size={30} className="mt-2"/> 
                    <p className="text-4xl">Total Donations </p>
                </div>
                
            </div>
            <div className="col-span-3 row-span-3 bg-white rounded shadow-md border-2 border-gray-200">
                    <div className="flex gap-2 p-5">
                    <Users size={30} className="mt-2"/> 
                    <p className="text-4xl">People Fed </p>
                </div>
            </div>
        </>
    )
}