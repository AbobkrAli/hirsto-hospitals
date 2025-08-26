import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const InactivePharmacyMessage: React.FC = () => {
  return (
    <div className="flex items-center w-full bg-white border border-orange-200 rounded-2xl shadow-lg p-8">
      <div className="flex items-center w-full">
        <div className="relative flex-shrink-0 mr-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="text-left w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-subtitles">
            Account Under Review
          </h2>
          <p className="text-gray-700 text-base leading-relaxed font-paragraphs">
            Your pharmacy account is currently being verified by our team. This process typically takes <strong>2-3 business days</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InactivePharmacyMessage;
