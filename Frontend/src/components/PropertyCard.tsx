import React from 'react';
import { 
  Building2, MapPin, Ruler, Layout, Users, Calendar,
  FileText, Shield, Truck, School, Copy, ExternalLink
} from 'lucide-react';
import { ZoningDetails } from '../types';

interface PropertyCardProps {
  property: ZoningDetails;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-fadeInUp">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-6 px-6 text-white">
        <h2 className="text-xl font-bold mb-2 break-words">{property.title}</h2>
        <div className="text-blue-200 text-sm">{property.paragraphs[0]}</div>
      </div>

      <div className="p-6">
        {/* Property Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <Building2 size={18} className="text-blue-500 mr-2" />
            <span>
              <span className="font-bold">{property.lot['Number of Floors']}</span> Floors
            </span>
          </div>
          
          <div className="flex items-center">
            <Layout size={18} className="text-blue-500 mr-2" />
            <span>
              <span className="font-bold">{property.lot['Gross Floor Area']}</span>
            </span>
          </div>
          
          <div className="flex items-center">
            <Users size={18} className="text-blue-500 mr-2" />
            <span>
              <span className="font-bold">{property.lot['Residential Units']}</span> Units
            </span>
          </div>
        </div>
        
        {/* Lot Details */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Lot Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(property.lot).map(([key, value]) => (
              <div key={key} className="flex items-start">
                <div className="w-full">
                  <h4 className="text-sm font-semibold text-gray-500">{key}</h4>
                  <p className="text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zoning Details */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Zoning</h3>
          <div className="flex flex-wrap gap-2">
            {property.zoningDetails.map((zone, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {zone.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Neighborhood Details */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Neighborhood Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(property.neighborhood).map(([key, value]) => (
              <div key={key} className="flex items-start">
                <div className="w-full">
                  <h4 className="text-sm font-semibold text-gray-500">{key}</h4>
                  <p className="text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button 
            onClick={() => copyToClipboard(property.title)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy size={16} className="mr-2" />
            Copy Address
          </button>
          
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(property.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
          >
            <ExternalLink size={16} className="mr-2" />
            View on Map
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;